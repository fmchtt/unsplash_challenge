import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { pegarImagem } from "../services/imageService";
import { GiReturnArrow } from "react-icons/gi";
import { BsPlusCircleFill } from "react-icons/bs";
import "../styles/imagePage.css";
import { getTags } from "../services/tagService";

function Image() {
  const [imagem, setImagem] = useState();
  const [tags, setTags] = useState()
  const [trocarTag, setTrocarTag] = useState(false);

  let { id } = useParams();

  const history = useHistory();

  useEffect(() => {
    pegarImagem(id).then((e) => {
      setImagem(e);
    });
    getTags().then((e) => {
        setTags(e)
    }) 
  });
  if (imagem) {
    return (
      <div className="page-image-div">
        <GiReturnArrow
          className="page-image-voltar"
          onClick={() => {
            history.goBack();
          }}
        />
        <div className="page-image-grupo">
          <img src={imagem.path} className="page-image-imagem" />
          <div>
            <div>
              <img
                src={imagem.owner.avatar_url}
                className="page-image-avatar"
              ></img>
              <h5 className="page-image-nome">{imagem.owner.username}</h5>
            </div>
            <h6 className="page-image-titulo">Titulo: {imagem.title}</h6>
            <p className="page-image-descricao">
              Descrição: {imagem.description}
            </p>
            <div>
              {imagem.tags.map((e) => {
                return <p className="page-image-descricao">{e.name}</p>;
              })}
              {!trocarTag ? (
                <BsPlusCircleFill
                  className="page-image-addTag"
                  onClick={(e) => {
                    e.preventDefault();
                    setTrocarTag(true);
                  }}
                />
              ) : (
                <select name="tag_id" id="tag_id">
                  <option value="">Selecione</option>
                  {tags.map((tag) => {
                    return (
                      <option key={tag.name + tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else return null;
}

export default Image;
