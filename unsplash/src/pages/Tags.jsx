import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { GiReturnArrow } from "react-icons/gi";
import { ImSpinner9 } from "react-icons/im";
import { AiOutlineClose } from "react-icons/ai";
import { buscarTag, getTags } from "../services/tagService";
import ImageCard from "../components/ImageCard";
import { getLogado } from "../services/loginService";
import { deleteImage } from "../services/imageService";

function Tags() {
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState({ id: 0, username: "Anônimo" });
  const [nomeTag, setNomeTag] = useState();
  const [deletar, setDeletar] = useState(false);
  const [idImagem, setIdImagem] = useState();
  const [spinner, setSpinner] = useState(true);

  let { id } = useParams();

  const history = useHistory();

  function carregar() {
    setSpinner(true);
    buscarTag(id).then((tag) => {
      let count = 1;
      let array1 = [];
      let array2 = [];
      let array3 = [];
      let imagens = tag.images;
      setNomeTag(tag.name);
      imagens.forEach((image) => {
        if (count == 1) {
          array1.push(image);
          count = 2;
        } else if (count == 2) {
          array2.push(image);
          count = 3;
        } else if (count == 3) {
          array3.push(image);
          count = 1;
        }
      });
      setImages1(array1);
      setImages2(array2);
      setImages3(array3);
    });
    setSpinner(false);
  }

  useEffect(() => {
    carregar();
    setSpinner(true);
    if (localStorage.getItem("token")) {
      getLogado().then((log) => {
        setUsuario(log);
      });
      setLogado(true);
    }
    setSpinner(false);
  }, []);

  return (
    <div>
      <GiReturnArrow
        className="page-image-voltar"
        onClick={() => {
          history.push("/");
        }}
      />
      <header className="page-tag-header">
        <h1 className="page-tag-titulo">{nomeTag}</h1>
      </header>
      {spinner ? (
        <div className="div-spinner">
          <ImSpinner9 className="spinner" />
        </div>
      ) : null}
      <main>
        {deletar ? (
          <div className="modal">
            <AiOutlineClose
              className="sair-modal"
              onClick={() => {
                setDeletar(false);
              }}
            />
            <div className="modal-deletar">
              <p>Tem certeza que deseja deletar a imagem?</p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSpinner(true);
                  setDeletar(false);
                  deleteImage(idImagem).then((e) => {
                    if (e) {
                      carregar();
                    }
                  });
                  carregar();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        ) : null}
        <div>
          {images1.map((image) => {
            return (
              <ImageCard
                key={image.title + image.id}
                image={image}
                clickDelete={(id) => {
                  setIdImagem(id);
                  setDeletar(true);
                }}
                onClick={() => {
                  history.push(`/image/${image.id}/`);
                }}
                tagClick={(id) => {
                  history.push(`/tags/${id}/`);
                }}
                showDelete={image.owner_id == usuario.id}
                avatar={false}
              />
            );
          })}
        </div>
        <div>
          {images2.map((image) => {
            return (
              <ImageCard
                key={image.title + image.id}
                image={image}
                clickDelete={(id) => {
                  setIdImagem(id);
                  setDeletar(true);
                }}
                onClick={() => {
                  history.push(`/image/${image.id}`);
                }}
                tagClick={(id) => {
                  history.push(`/tags/${id}/`);
                }}
                showDelete={image.owner_id == usuario.id}
                avatar={false}
              />
            );
          })}
        </div>
        <div>
          {images3.map((image) => {
            return (
              <ImageCard
                key={image.title + image.id}
                image={image}
                clickDelete={(id) => {
                  setIdImagem(id);
                  setDeletar(true);
                }}
                onClick={() => {
                  history.push(`/image/${image.id}`);
                }}
                tagClick={(id) => {
                  history.push(`/tags/${id}/`);
                }}
                showDelete={image.owner_id == usuario.id}
                avatar={false}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Tags;
