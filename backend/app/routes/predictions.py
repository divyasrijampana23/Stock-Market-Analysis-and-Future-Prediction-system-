from fastapi import APIRouter # type: ignore
from app.services.predictions import get_real_predictions  # Make sure the path is correct

router = APIRouter()

@router.get("/predictions/{symbol}")
def get_stock_predictions(symbol: str):
    return get_real_predictions(symbol.upper())
