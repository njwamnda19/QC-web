from fastapi import FastAPI
from api.routes import sales

# 1. Impor engine dan Base dari konfigurasi database-mu
from db.database import engine, Base

# 2. KRITIS: Impor model-modelmu di sini. 
# Jika baris ini terlewat, SQLAlchemy tidak akan membuat tabel 'sales'.
from models import sales as sales_model

# 3. Eksekusi pembuatan tabel.
# Ini akan menginstruksikan SQLite untuk membuat file dan tabel jika belum ada.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Qualitrack API")

app.include_router(sales.router, prefix="/api/sales", tags=["Sales"])