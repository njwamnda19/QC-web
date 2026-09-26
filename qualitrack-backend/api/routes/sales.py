# api/routes/sales.py — Updated dengan GET, POST, PUT, DELETE
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services import sales_service
from schemas.sales import SalesCreate, SalesOut
from api.dependencies import get_db
from typing import List

router = APIRouter()

@router.get("/", response_model=List[SalesOut])
def get_sales(db: Session = Depends(get_db)):
    return sales_service.get_all_sales(db)

@router.post("/add", response_model=SalesOut)
def add_sales(payload: SalesCreate, db: Session = Depends(get_db)):
    return sales_service.create_new_sales(db, payload)

@router.put("/{sales_id}", response_model=SalesOut)
def update_sales(sales_id: int, payload: SalesCreate, db: Session = Depends(get_db)):
    result = sales_service.update_sales(db, sales_id, payload)
    if not result:
        raise HTTPException(status_code=404, detail="Sales not found")
    return result

@router.delete("/{sales_id}")
def delete_sales(sales_id: int, db: Session = Depends(get_db)):
    success = sales_service.delete_sales(db, sales_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sales not found")
    return {"status": "success", "message": "Sales deleted"}