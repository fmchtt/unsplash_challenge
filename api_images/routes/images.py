from fastapi import APIRouter, File, UploadFile, Form, Depends, Request
from typing import List
from api_images.controllers import images_controller
from api_images.schemas import images_schema
from sqlalchemy.orm import Session
from api_images.database import SessionLocal
from api_images.routes.auth import oauth2_scheme, decript_token

router = APIRouter()

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.get("/", response_model=List[images_schema.Images])
def listar_imagens(request: Request, skip: int = 0, limit: int = 100, tag: str = None, title: str = None, db: Session = Depends(get_db)):
    images = images_controller.lista_imagens(db, tag, title, request.base_url, skip=skip, limit=limit)
    return images

@router.get("/{image_id:int}/", response_model=images_schema.Images)
def buscar_imagem(request: Request, image_id: int, db: Session = Depends(get_db)):
    image = images_controller.buscar_imagem(db, image_id, request.base_url)
    return image

@router.post("/", response_model=images_schema.Images, status_code=201)
def criar_imagem(request: Request, title: str = Form(...), description: str = Form(...), tag_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user_id = decript_token(token)
    return images_controller.criar_imagem(db, user_id.get('id'), title, description, tag_id, request.base_url, file=file)

@router.delete("/{image_id:int}/", response_model=images_schema.ImagesDelete)
def deletar_imagem(image_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user_id = decript_token(token)
    deleted = images_controller.deletar_imagem(db, image_id, user_id.get('id'))
    return deleted