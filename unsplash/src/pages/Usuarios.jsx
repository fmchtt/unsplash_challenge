import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { buscarUsuario } from "../services/usuarioService";
import { AiOutlineClose } from "react-icons/ai";
import { GiReturnArrow } from "react-icons/gi";
import { ImSpinner9 } from "react-icons/im";
import ImageCard from "../components/ImageCard";
import { darLike, deleteImage } from "../services/imageService";
import { getLogado } from "../services/loginService";

function Usuarios() {
  const [spinner, setSpinner] = useState(true);
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [deletar, setDeletar] = useState(false);
  const [idImagem, setIdImagem] = useState();
  const [usuario, setUsuario] = useState([]);
  const [logado, setLogado] = useState();

  const history = useHistory();

  let { id } = useParams();

  function carregar() {
    setSpinner(true);
    buscarUsuario(id).then((u) => {
      let count = 1;
      let array1 = [];
      let array2 = [];
      let array3 = [];
      let imagens = u.images;
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
    setSpinner(true);
    getLogado().then((e) => {
      setLogado(e);
    });
    buscarUsuario(id)
      .then((e) => {
        setUsuario(e);
      })
      .then(carregar());
  }, []);

  return (
    <div>
      <GiReturnArrow
        className="page-image-voltar"
        onClick={() => {
          history.push("/");
        }}
      />
      {spinner ? (
        <div className="div-spinner">
          <ImSpinner9 className="spinner" />
        </div>
      ) : null}
      <div className="div-avatar">
        <img
          src={
            usuario.avatar_url
              ? usuario.avatar_url
              : "https://via.placeholder.com/75"
          }
          alt="avatar"
          className="avatar"
        />
        <h3>Ola {usuario.username}</h3>
      </div>
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
          {images1.map((image, Index) => {
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
                onLikeClick={() => {
                  darLike(image.id).then((e) => {
                    let aux = [...images1];
                    aux[Index] = e;
                    setImages1(aux);
                  });
                }}
                tagClick={(id) => {
                  history.push(`/tags/${id}/`);
                }}
                showDelete={usuario.id == logado.id}
                avatar={false}
              />
            );
          })}
        </div>
        <div>
          {images2.map((image, Index) => {
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
                onLikeClick={() => {
                  darLike(image.id).then((e) => {
                    let aux = [...images2];
                    aux[Index] = e;
                    setImages2(aux);
                  });
                }}
                tagClick={(id) => {
                  history.push(`/tags/${id}/`);
                }}
                showDelete={usuario.id == logado.id}
                avatar={false}
              />
            );
          })}
        </div>
        <div>
          {images3.map((image, Index) => {
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
                onLikeClick={() => {
                  darLike(image.id).then((e) => {
                    let aux = [...images3];
                    aux[Index] = e;
                    setImages3(aux);
                  });
                }}
                tagClick={(id) => {
                  history.push(`/tags/${id}/`);
                }}
                showDelete={usuario.id == logado.id}
                avatar={false}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Usuarios;
