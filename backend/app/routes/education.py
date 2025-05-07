from fastapi import APIRouter

router = APIRouter()

@router.get("/education", tags=["Education"])
def get_education_content():
    return {
        "articles": [
            {
                "title": "📘 What is a Stock?",
                "content": "A stock is a type of investment that represents ownership in a company..."
            },
            {
                "title": "📊 Understanding Stock Charts",
                "content": "Stock charts show the historical performance of a stock using price and volume data..."
            },
            {
                "title": "📈 Technical vs. Fundamental Analysis",
                "content": "Fundamental analysis evaluates company financials, while technical analysis uses price trends..."
            },
            {
                "title": "🧠 Key Market Terms",
                "content": "Learn common terms like IPO, market cap, dividends, P/E ratio, and more..."
            }
        ]
    }
