import hashlib
import hmac
import os
import secrets
import smtplib
import ssl
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from typing import Any
from urllib.parse import urlencode, urlsplit

import jwt

from auth import ALGORITHM, SECRET_KEY


class PasswordResetConfigurationError(Exception):
    pass


class PasswordResetDeliveryError(Exception):
    pass


@dataclass(frozen=True)
class PasswordResetConfiguration:
    host: str
    port: int
    username: str
    password: str
    from_email: str
    frontend_url: str
    use_ssl: bool


def _reset_signing_key() -> bytes:
    if SECRET_KEY == "dev-secret-change-this" or len(SECRET_KEY) < 32:
        raise PasswordResetConfigurationError(
            "Set JWT_SECRET_KEY to a secret of at least 32 characters."
        )
    return hmac.new(
        SECRET_KEY.encode("utf-8"),
        b"menoverse-password-reset-v1",
        hashlib.sha256,
    ).digest()


def validate_password_reset_configuration() -> PasswordResetConfiguration:
    _reset_signing_key()
    host = os.getenv("SMTP_HOST", "")
    port_value = os.getenv("SMTP_PORT", "")
    username = os.getenv("SMTP_USERNAME", "")
    password = os.getenv("SMTP_PASSWORD", "")
    from_email = os.getenv("SMTP_FROM_EMAIL", "")
    frontend_url_value = os.getenv("FRONTEND_URL", "")
    required = {
        "SMTP_HOST": host,
        "SMTP_PORT": port_value,
        "SMTP_USERNAME": username,
        "SMTP_PASSWORD": password,
        "SMTP_FROM_EMAIL": from_email,
        "FRONTEND_URL": frontend_url_value,
    }
    missing = [name for name, value in required.items() if not value]
    if missing:
        raise PasswordResetConfigurationError(
            f"Missing password reset settings: {', '.join(missing)}."
        )

    try:
        port = int(port_value)
    except (TypeError, ValueError) as exc:
        raise PasswordResetConfigurationError(
            "SMTP_PORT must be a valid port number."
        ) from exc
    if not 1 <= port <= 65535:
        raise PasswordResetConfigurationError(
            "SMTP_PORT must be between 1 and 65535."
        )

    frontend_url = frontend_url_value.rstrip("/")
    try:
        parsed_url = urlsplit(frontend_url)
        local_host = parsed_url.hostname in {"localhost", "127.0.0.1", "::1"}
    except ValueError as exc:
        raise PasswordResetConfigurationError(
            "FRONTEND_URL must be a valid URL."
        ) from exc
    if (
        parsed_url.scheme not in ({"http", "https"} if local_host else {"https"})
        or not parsed_url.netloc
        or parsed_url.username
        or parsed_url.password
        or parsed_url.query
        or parsed_url.fragment
    ):
        raise PasswordResetConfigurationError(
            "FRONTEND_URL must be an HTTPS URL (HTTP is allowed only for localhost)."
        )

    use_ssl = os.getenv("SMTP_USE_SSL", "false").strip().lower()
    if use_ssl not in {"true", "false"}:
        raise PasswordResetConfigurationError(
            "SMTP_USE_SSL must be true or false."
        )

    return PasswordResetConfiguration(
        host=required["SMTP_HOST"],
        port=port,
        username=username,
        password=password,
        from_email=from_email,
        frontend_url=frontend_url,
        use_ssl=use_ssl == "true",
    )


def create_password_reset_token(user_id: int, email: str) -> str:
    issued_at = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(user_id),
            "email": email,
            "purpose": "password-reset",
            "jti": secrets.token_urlsafe(32),
            "iat": issued_at,
            "exp": issued_at + timedelta(minutes=30),
        },
        _reset_signing_key(),
        algorithm=ALGORITHM,
    )


def verify_password_reset_token(token: str) -> dict[str, Any]:
    try:
        claims = jwt.decode(
            token,
            _reset_signing_key(),
            algorithms=[ALGORITHM],
            options={"require": ["sub", "email", "purpose", "jti", "exp"]},
        )
    except PasswordResetConfigurationError:
        raise
    except jwt.InvalidTokenError as exc:
        raise ValueError("Invalid or expired password reset token.") from exc

    if claims.get("purpose") != "password-reset":
        raise ValueError("Invalid or expired password reset token.")
    try:
        int(claims["sub"])
        if not claims["email"] or not claims["jti"]:
            raise ValueError
    except (KeyError, TypeError, ValueError) as exc:
        raise ValueError("Invalid or expired password reset token.") from exc
    return claims


def send_password_reset_email(
    configuration: PasswordResetConfiguration,
    email: str,
    token: str,
) -> None:
    reset_url = (
        f"{configuration.frontend_url}/reset-password?"
        f"{urlencode({'token': token})}"
    )
    message = EmailMessage()
    message["Subject"] = "Reset your MenoVerse password"
    message["From"] = configuration.from_email
    message["To"] = email
    message.set_content(
        "We received a request to reset your MenoVerse password.\n\n"
        f"Use this link within 30 minutes to choose a new password:\n{reset_url}\n\n"
        "If you did not request this, you can ignore this email."
    )

    try:
        if configuration.use_ssl:
            with smtplib.SMTP_SSL(
                configuration.host,
                configuration.port,
                timeout=10,
                context=ssl.create_default_context(),
            ) as smtp:
                smtp.login(configuration.username, configuration.password)
                smtp.send_message(message)
        else:
            with smtplib.SMTP(
                configuration.host,
                configuration.port,
                timeout=10,
            ) as smtp:
                smtp.ehlo()
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
                smtp.login(configuration.username, configuration.password)
                smtp.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        raise PasswordResetDeliveryError(
            "The password reset email could not be sent."
        ) from exc
