from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services import sales_service
from schemas.sales import SalesCreate
from api.dependencies import get_db

router = APIRouter()

# Injeksi get_db ke dalam rute
# api/routes/sales.py
# (Pastikan Depends dan get_db sudah terimpor)

# Pastikan kamu mengimpor SalesCreate dari schemas dan get_db dari dependencies
@router.post("/add")
def add_sales(payload: SalesCreate, db: Session = Depends(get_db)):
    result = sales_service.create_new_sales(db, payload)
    return {"status": "success", "data": result}