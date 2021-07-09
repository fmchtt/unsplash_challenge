from api_images.database import Base
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship

association_table = Table('association_tag_image', Base.metadata,
    Column('id', Integer, primary_key=True, index=True),
    Column('tag_id', Integer, ForeignKey('tags.id')),
    Column('image_id', Integer, ForeignKey('images.id'))
)

class Tags(Base):
  __tablename__ = 'tags'

  id = Column(Integer, primary_key=True, index=True)
  name = Column(String(50), nullable=False)
  images = relationship("Images", secondary=association_table, back_populates='tags')