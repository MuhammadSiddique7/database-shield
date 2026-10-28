from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import QueryInput, DetectionResult
from app.detector import SQLDetector
from app.patterns import SQL_PATTERNS
from app.ml.predictor import predictor
import uvicorn
import os

detector = SQLDetector()


@asynccontextmanager
async def lifespan(application: FastAPI):
    loaded = predictor.load()
    mode = 'hybrid (rules + ML)' if loaded else 'rules-only'
    print(f'Detection Engine started with {len(SQL_PATTERNS)} patterns loaded | mode: {mode}')
    yield


app = FastAPI(
    title='Database Shield Detection Engine',
    version='1.1.0',
    description='SQL Injection Detection API (rules + ML)',
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def health_check():
    return {
        'status': 'online',
        'service': 'Database Shield Detection Engine',
        'version': '1.1.0'
    }


@app.post('/detect', response_model=DetectionResult)
def detect_query(payload: QueryInput):
    return detector.detect(payload.query, payload.database_type)


@app.get('/health')
def detailed_health():
    return {
        'status': 'healthy',
        'patterns_loaded': len(SQL_PATTERNS),
        'model_loaded': predictor.available,
        'mode': 'hybrid' if predictor.available else 'rules-only',
        'version': '1.1.0'
    }


if __name__ == '__main__':
    uvicorn.run('app.main:app', host='0.0.0.0', port=int(os.getenv('PORT', 8000)), reload=True)