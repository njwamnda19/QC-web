# db/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Menggunakan SQLite untuk development (file akan terbuat otomatis bernama qualitrack.db)
SQLALCHEMY_DATABASE_URL = "sqlite:///./qualitrack.db"

# Engine adalah penghubung fisik ke file database
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal adalah pabrik pembuat sesi transaksi database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base adalah kelas induk untuk semua tabel modelmu
Base = declarative_base()