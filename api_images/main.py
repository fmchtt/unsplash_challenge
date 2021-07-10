from fastapi import FastAPI
from api_images.database import Base, engine
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from api_images.router import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Unsplash Api", description="Api para o unsplash, servindo imagens, tags, usuarios e autenticação!", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=['*'],allow_methods=["*"],allow_headers=["*"])

app.mount("/uploads", StaticFiles(directory="uploads"), name="static")

app.include_router(router, prefix='/api')