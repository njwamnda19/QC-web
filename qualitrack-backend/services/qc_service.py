# services/qc_service.py — CRUD untuk QC records
from sqlalchemy.orm import Session
from models.qc import QCRecord
from schemas.qc import QCCreate

def create_qc_record(db: Session, qc_data: QCCreate):
    db_item = QCRecord(
        inspector_name=qc_data.inspector_name,
        sales_target=qc_data.sales_target,
        inspection_date=qc_data.inspection_date,
        program_accuracy=qc_data.program_accuracy,
        response_time=qc_data.response_time,
        follow_up_technical=qc_data.follow_up_technical,
        empathy_comm=qc_data.empathy_comm,
        grammar=qc_data.grammar,
        closing_conversion=qc_data.closing_conversion,
        score=qc_data.score,
        notes=qc_data.notes,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_all_qc(db: Session):
    return db.query(QCRecord).order_by(QCRecord.created_at.desc()).all()
