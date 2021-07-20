from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import Table
from api_images.models.tags_model import association_table

from api_images.database import Base

association_table_likes = Table('images_likes', Base.metadata, 
    Column('id', Integer, primary_key=True, index=True),
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('image_id', Integer, ForeignKey('images.id'))
)
class Images(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), index=True)
    description = Column(String(200), index=True)
    path = Column(String(200), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="images")
    tags = relationship("Tags", secondary=association_table, back_populates='images')
    likes = relationship("User", secondary=association_table_likes, back_populates='liked')