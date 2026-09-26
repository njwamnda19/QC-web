from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import sales, qc

from db.database import engine, Base
from models import sales as sales_model
from models import qc as qc_model

# Buat semua tabel jika belum ada
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Qualitrack API", version="1.0.0")

# CORS: izinkan frontend React (localhost:5173) mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sales.router, prefix="/api/sales", tags=["Sales"])
app.include_router(qc.router, prefix="/api/qc", tags=["QC"])

@app.get("/")
def root():
    return {"message": "QualiTrack API is running", "version": "1.0.0"}