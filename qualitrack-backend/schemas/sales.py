# schemas/sales.py
from pydantic import BaseModel, Field

# Schema ini adalah cetakan untuk data masuk (Request Body)
class SalesCreate(BaseModel):
    item_name: str = Field(..., min_length=3, description="Nama item minimal 3 karakter")
    quantity: int = Field(..., gt=0, description="Kuantitas harus lebih besar dari 0")
    price: float = Field(..., gt=0.0, description="Harga tidak boleh negatif atau nol")