import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { pegarImagem } from "../services/imageService";
import { GiReturnArrow } from "react-icons/gi";
import { BsPlusCircleFill } from "react-icons/bs";
import "../styles/imagePage.css";
import { deletarTag, getTags, postTagImagem } from "../services/tagService";
import { MdDelete } from "react-icons/md";
import { getLogado } from "../services/loginService";

function Image() {
  const [imagem, setImagem] = useState();
  const [tags, setTags] = useState();
  const [trocarTag, setTrocarTag] = useState(false);
  const [usuario, setUsuario] = useState();

  let { id } = useParams();

  const history = useHistory();

  useEffect(() => {
    pegarImagem(id).then((e) => {
      setImagem(e);
    });
    getTags().then((e) => {
      setTags(e);
    });
    getLogado().then((e) => {
      setUsuario(e);
    });
  }, []);

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
                src={
                  imagem.owner.avatar_url
                    ? imagem.owner.avatar_url
                    : "https://via.placeholder.com/75"
                }
                className="page-image-avatar"
              ></img>
              <h1 className="page-image-nome">{imagem.owner.username}</h1>
            </div>
            <h2 className="page-image-titulo">{imagem.title}</h2>
            <p className="page-image-descricao">{imagem.description}</p>
            <div>
              {imagem.tags.map((e) => {
                const tagId = e;
                return (
                  <p className="page-image-tag">
                    {tagId.name}
                    {usuario.id == imagem.owner.id ? (
                      <MdDelete
                        className="page-image-deletar"
                        onClick={() => {
                          deletarTag(imagem.id, tagId.id).then((e) => {
                            setImagem(e);
                          });
                        }}
                      />
                    ) : null}
                  </p>
                );
              })}
              {usuario.id == imagem.owner.id ? (
                !trocarTag ? (
                  <BsPlusCircleFill
                    className="page-image-addTag"
                    onClick={(e) => {
                      e.preventDefault();
                      setTrocarTag(true);
                    }}
                  />
                ) : (
                  <select
                    name="tag_id"
                    id="tag_id"
                    onChange={(e) => {
                      postTagImagem(imagem.id, e.target.value).then((e) => {
                        setImagem(e);
                      });
                      // console.log(e.target.value)
                      setTrocarTag(false);
                    }}
                  >
                    <option value="" disabled selected>
                      Selecione
                    </option>
                    {tags.map((tag) => {
                      return (
                        <option key={tag.name + tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      );
                    })}
                  </select>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  } else return null;
}

export default Image;
