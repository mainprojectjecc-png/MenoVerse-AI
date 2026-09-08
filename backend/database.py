from sqlalchemy import create_engine
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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        