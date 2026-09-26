# schemas/qc.py — Pydantic schema untuk QC form
from pydantic import BaseModel
from typing import Optional

class QCCreate(BaseModel):
    inspector_name: str
    sales_target: Optional[str] = None
    inspection_date: Optional[str] = None
    program_accuracy: Optional[int] = None
    response_time: Optional[int] = None
    follow_up_technical: Optional[int] = None
    empathy_comm: Optional[int] = None
    grammar: Optional[int] = None
    closing_conversion: Optional[int] = None
    score: Optional[float] = None
    notes: Optional[str] = None

class QCOut(QCCreate):
    id: int

    class Config:
        from_attributes = True
