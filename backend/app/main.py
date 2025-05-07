from fastapi import FastAPI  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore

# ✅ Database setup
from app.database import Base, engine

# ✅ IMPORTANT: Import all models before calling create_all()
from app.models import user  # ← add all your model files here

# ✅ Create DB tables now that models are known
Base.metadata.create_all(bind=engine)

# ✅ Initialize FastAPI
app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Import routers
from app.routes import (
    auth, user, admin, user_admin, stock, news,
    currency, tweets, sentiment, predictions, history, recommendation
)

# ✅ Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(user.router, prefix="/api/user", tags=["User"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(user_admin.router, prefix="/api/admin/users", tags=["User Management"])
app.include_router(stock.router, prefix="/api/stock", tags=["Stock Data"])
app.include_router(news.router, prefix="/api", tags=["News"])
app.include_router(currency.router, prefix="/api/currency", tags=["Currency Converter"])
app.include_router(tweets.router, prefix="/api")
app.include_router(sentiment.router, prefix="/api")
app.include_router(predictions.router, prefix="/api")
app.include_router(history.router, prefix="/api", tags=["History"])
app.include_router(recommendation.router, prefix="/api", tags=["Recommendation"])