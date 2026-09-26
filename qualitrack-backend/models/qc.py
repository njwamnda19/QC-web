# models/qc.py — Model untuk hasil evaluasi QC
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from db.database import Base

class QCRecord(Base):
    __tablename__ = "qc_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    inspector_name = Column(String, nullable=False)
    sales_target = Column(String, nullable=True)       # nama sales yang dinilai
    inspection_date = Column(String, nullable=True)

    # Core Factor (bobot 40%)
    program_accuracy = Column(Integer, nullable=True)  # rating 1-5

    # Secondary Factors (bobot 60%)
    response_time = Column(Integer, nullable=True)
    follow_up_technical = Column(Integer, nullable=True)
    empathy_comm = Column(Integer, nullable=True)
    grammar = Column(Integer, nullable=True)
    closing_conversion = Column(Integer, nullable=True)

    # Skor akhir (0-100) dan catatan
    score = Column(Float, nullable=True)
    notes = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
