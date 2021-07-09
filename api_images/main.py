from fastapi import FastAPI
from api_images.database import Base, engine, SessionLocal
from fastapi.staticfiles import StaticFiles
from api_images.routes import users, images, auth
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=['*'],allow_methods=["*"],allow_headers=["*"])
app.mount("/static", StaticFiles(directory="uploads"), name="static")

app.include_router(users.router, prefix="/users", tags=['Usuarios'])
app.include_router(images.router, prefix="/images", tags=['Imagens'])
app.include_router(auth.router)