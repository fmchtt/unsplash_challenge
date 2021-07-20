import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { alterarImagem, pegarImagem } from "../services/imageService";
import { GiReturnArrow } from "react-icons/gi";
import { BsPlusCircleFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { ImSpinner9 } from "react-icons/im";
import "../styles/imagePage.css";
import { buscarTag, deletarTag, getTags, postTagImagem } from "../services/tagService";
import { getLogado } from "../services/loginService";

function Image() {
  const [imagem, setImagem] = useState();
  const [tags, setTags] = useState();
  const [trocarTag, setTrocarTag] = useState(false);
  const [usuario, setUsuario] = useState({ id: 0 });
  const [modal, setModal] = useState(false);
  const [titulo, setTitulo] = useState();
  const [descricao, setDescricao] = useState();
  const [spinner, setSpinner] = useState(true);

  let { id } = useParams();

  const history = useHistory();

  useEffect(() => {
    setSpinner(true);
    pegarImagem(id).then((e) => {
      setImagem(e);
    });
    getTags().then((e) => {
      setTags(e);
    });
    getLogado().then((e) => {
      setUsuario(e);
    });
    setSpinner(false);
  }, []);

  if (imagem) {
    return (
      <div className="page-image-div">
        <GiReturnArrow
          className="page-image-voltar"
          onClick={() => {
            history.push("/");
          }}
        />
        <div className="page-image-grupo">
          <img src={imagem.path} className="page-image-imagem" />
          <div>
            <div className="page-image-grupo-avatar">
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
            <div className="page-image-grupo-titulo-alterar">
              <h2 className="page-image-titulo">{imagem.title}</h2>
              {usuario.id == imagem.owner.id ? (
                <FiEdit
                  className="page-image-alterar"
                  onClick={() => {
                    setSpinner(true);
                    setTitulo(imagem.title);
                    setDescricao(imagem.description);
                    setModal(true);
                    setSpinner(false);
                  }}
                />
              ) : null}
            </div>
            <p className="page-image-descricao">{imagem.description}</p>
            {modal ? (
              <div className="page-image-modal-fundo">
                <AiOutlineClose
                  className="sair-modal"
                  onClick={() => {
                    setSpinner(true);
                    setModal(false);
                    setSpinner(false);
                  }}
                />
                <form
                  className="page-image-modal-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alterarImagem(imagem.id, titulo, descricao).then((e) => {
                      setImagem(e);
                    });
                    setModal(false);
                  }}
                >
                  <label htmlFor="titulo">Título</label>
                  <input
                    type="text"
                    name="titulo"
                    value={titulo}
                    onChange={(e) => {
                      setTitulo(e.target.value);
                    }}
                  />
                  <label htmlFor="descricao">Descrição</label>
                  <input
                    type="text"
                    name="descricao"
                    value={descricao}
                    onChange={(e) => {
                      setDescricao(e.target.value);
                    }}
                  />
                  <button type="submit" className="page-image-modal-button">
                    Confirmar
                  </button>
                </form>
              </div>
            ) : null}
            {spinner ? (
              <div className="div-spinner">
                <ImSpinner9 className="spinner" />
              </div>
            ) : null}
            <div className="page-image-grupo-avatar">
              {imagem.tags.map((e) => {
                const tag = e;
                return (
                  <p className="page-image-tag" key={tag.name + tag.id} onClick={(e) =>{
                    console.log(tag.id)
                    buscarTag(tag.id).then(
                      history.push(`/tags/${tag.id}/`)
                    )
                  }} >
                    {tag.name}
                    {usuario.id == imagem.owner.id ? (
                      <MdDelete
                        className="page-image-deletar"
                        onClick={() => {
                          setSpinner(true);
                          deletarTag(imagem.id, tag.id).then((e) => {
                            setImagem(e);
                            setSpinner(false);
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
                    className="page-image-select"
                    onChange={(e) => {
                      setSpinner(true);
                      postTagImagem(imagem.id, e.target.value).then((e) => {
                        setImagem(e);
                        setSpinner(false);
                      });
                      setTrocarTag(false);
                    }}
                  >
                    <option value="" disabled selected>
                      Selecione
                    </option>
                    {tags.map((tag) => {
                      return (
                        <option key={tag.name + tag.id} value={tag.id} >
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
