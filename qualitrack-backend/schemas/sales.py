# schemas/sales.py — Updated schema sesuai frontend
from pydantic import BaseModel
from typing import Optional

class SalesCreate(BaseModel):
    name: str
    email: Optional[str] = None
    region: str
    total_sales: Optional[str] = None
    achievement: Optional[float] = None

class SalesOut(SalesCreate):
    id: int

    class Config:
        from_attributes = True