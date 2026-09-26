# services/sales_service.py — Updated service layer
from sqlalchemy.orm import Session
from models.sales import SalesRecord
from schemas.sales import SalesCreate

def create_new_sales(db: Session, sales_data: SalesCreate):
    db_item = SalesRecord(
        name=sales_data.name,
        email=sales_data.email,
        region=sales_data.region,
        total_sales=sales_data.total_sales,
        achievement=sales_data.achievement,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_all_sales(db: Session):
    return db.query(SalesRecord).all()

def delete_sales(db: Session, sales_id: int):
    record = db.query(SalesRecord).filter(SalesRecord.id == sales_id).first()
    if not record:
        return False
    db.delete(record)
    db.commit()
    return True

def update_sales(db: Session, sales_id: int, sales_data: SalesCreate):
    record = db.query(SalesRecord).filter(SalesRecord.id == sales_id).first()
    if not record:
        return None
    record.name = sales_data.name
    record.email = sales_data.email
    record.region = sales_data.region
    record.total_sales = sales_data.total_sales
    record.achievement = sales_data.achievement
    db.commit()
    db.refresh(record)
    return record