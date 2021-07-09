from fastapi import APIRouter, File, UploadFile, Form, Depends
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
def listar_imagens(skip: int = 0, limit: int = 100, q: str = None, db: Session = Depends(get_db)):
    if q:
        images = images_controller.lista_tags(db, q, skip=skip, limit=limit)
        return images
    else:
        images = images_controller.listar_imagens(db, skip=skip, limit=limit)
        return images

@router.get("/{image_id}/", response_model=images_schema.Images)
def buscar_imagem(image_id: int, db: Session = Depends(get_db)):
    image = images_controller.buscar_imagem(db, image_id)
    return image

@router.post("/", response_model=images_schema.Images)
def criar_imagem(title: str = Form(...), description: str = Form(...), tag_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user_id = decript_token(token)
    return images_controller.criar_imagem(db, title=title, description=description, tag=tag_id, file=file, user_id=user_id.get('id'))

@router.delete("/{image_id}/", response_model=images_schema.ImagesDelete)
def deletar_imagem(image_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user_id = decript_token(token)
    deleted = images_controller.deletar_imagem(db, image_id, user_id.get('id'))
    return deleted