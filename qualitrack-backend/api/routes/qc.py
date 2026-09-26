# api/routes/qc.py — Routes untuk QC Assessment
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services import qc_service
from schemas.qc import QCCreate, QCOut
from api.dependencies import get_db
from typing import List

router = APIRouter()

@router.get("/", response_model=List[QCOut])
def get_qc_records(db: Session = Depends(get_db)):
    return qc_service.get_all_qc(db)

@router.post("/", response_model=QCOut)
def create_qc(payload: QCCreate, db: Session = Depends(get_db)):
    return qc_service.create_qc_record(db, payload)
