from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

def get_engine():
    possible_urls = [
        "mssql+pyodbc://@localhost\\SQLEXPRESS/HealthMonitorDB?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes&TrustServerCertificate=yes",
        "mssql+pyodbc://@localhost/HealthMonitorDB?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes&TrustServerCertificate=yes",
    ]
    for url in possible_urls:
        try:
            eng = create_engine(url)
            with eng.connect() as conn:
                pass
            print(f"Connected with: {url.split('@')[1].split('/')[0]}")
            return eng
        except:
            continue
    return create_engine(possible_urls[0])

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def ensure_voice_journal_columns():
    create_table = """
        CREATE TABLE dbo.VoiceJournal (
            JournalID INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
            UserID INT NOT NULL,
            EntryDate DATE NOT NULL,
            Content NVARCHAR(MAX) NULL,
            AudioURL NVARCHAR(500) NULL,
            Mood NVARCHAR(50) NULL,
            Symptoms NVARCHAR(MAX) NULL,
            Summary NVARCHAR(MAX) NULL
        )
    """
    statements = {
        "Mood": "ALTER TABLE dbo.VoiceJournal ADD Mood NVARCHAR(50) NULL",
        "Symptoms": "ALTER TABLE dbo.VoiceJournal ADD Symptoms NVARCHAR(MAX) NULL",
        "Summary": "ALTER TABLE dbo.VoiceJournal ADD Summary NVARCHAR(MAX) NULL",
    }

    try:
        with engine.begin() as connection:
            table_exists = connection.execute(
                text(
                    "SELECT 1 FROM INFORMATION_SCHEMA.TABLES "
                    "WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'VoiceJournal'"
                )
            ).first()
            if not table_exists:
                connection.execute(text(create_table))

            for column, statement in statements.items():
                exists = connection.execute(
                    text(
                        "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS "
                        "WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'VoiceJournal' "
                        "AND COLUMN_NAME = :column"
                    ),
                    {"column": column},
                ).first()
                if not exists:
                    connection.execute(text(statement))
    except Exception as error:
        print(f"VoiceJournal schema check skipped: {error}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        