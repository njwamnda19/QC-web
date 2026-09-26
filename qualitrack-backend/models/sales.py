# models/sales.py — Updated field agar sesuai dengan frontend
from sqlalchemy import Column, Integer, String, Float
from db.database import Base

class SalesRecord(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True)
    email = Column(String, nullable=True)
    region = Column(String, index=True)
    total_sales = Column(String, nullable=True)   # disimpan sebagai string (e.g. "Rp120,000")
    achievement = Column(Float, nullable=True)     # persentase, e.g. 110.0