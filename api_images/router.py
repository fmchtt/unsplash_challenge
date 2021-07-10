from fastapi import APIRouter
from api_images.routes import users, images, auth, tags

router = APIRouter()

router.include_router(users.router, prefix="/users", tags=['Usuarios'])
router.include_router(images.router, prefix="/images", tags=['Imagens'])
router.include_router(auth.router, tags=['Autenticação'])
router.include_router(tags.router, prefix="/tags", tags=['Tags'])