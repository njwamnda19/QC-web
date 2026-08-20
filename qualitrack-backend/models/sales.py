# models/sales.py
from sqlalchemy import Column, Integer, String, Float
from db.database import Base

class SalesRecord(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, index=True)
    quantity = Column(Integer)
    price = Column(Float)
    total_revenue = Column(Float)