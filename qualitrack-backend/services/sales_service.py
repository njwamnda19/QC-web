# Pastikan impor ini ada di bagian atas file
from sqlalchemy.orm import Session
from models.sales import SalesRecord
from schemas.sales import SalesCreate

# Ini adalah fungsi yang dicari oleh Router-mu!
def create_new_sales(db: Session, sales_data: SalesCreate):
    total_revenue = sales_data.quantity * sales_data.price

    db_item = SalesRecord(
        item_name=sales_data.item_name,
        quantity=sales_data.quantity,
        price=sales_data.price,
        total_revenue=total_revenue
    )

    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return db_item