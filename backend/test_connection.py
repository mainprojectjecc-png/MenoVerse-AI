from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT TOP 5 * FROM dbo.Users"))
    for row in result:
        print(row)