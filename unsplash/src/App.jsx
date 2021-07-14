import { useEffect, useState } from "react";
import {
  deleteImage,
  getImages,
  getPesquisaImages,
  postImage,
} from "./services/imageService";
import { login, getLogado } from "./services/loginService";
import { getTags } from "./services/tagService";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ImSpinner9 } from "react-icons/im";

function App() {
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState({ id: 0, username: "Anônimo" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [posting, setPosting] = useState(false);
  const [pesquisa, setPesquisa] = useState();
  const [spinner, setSpinner] = useState(true);

  function carregar() {
    setSpinner(true);
    getImages().then((img) => {
      let count = 1;
      let array1 = [];
      let array2 = [];
      let array3 = [];
      img.data.forEach((image) => {
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
      setSpinner(false);
    });
  }

  function pesquisarImages(e) {
    setSpinner(true);
    e.preventDefault();
    getPesquisaImages(pesquisa).then((img) => {
      let count = 1;
      let array1 = [];
      let array2 = [];
      let array3 = [];
      img.forEach((image) => {
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
      setSpinner(false);
    });
  }

  useEffect(() => {
    carregar();
    if (localStorage.getItem("token")) {
      setLogado(true);
    }
    getLogado().then((log) => {
      setUsuario(log);
    });
    getTags().then((tgs) => {
      setTags(tgs);
    });
  }, []);

  function submitImage(e) {
    setSpinner(true);
    setPosting(true);
    e.preventDefault();
    postImage(new FormData(e.target)).then(() => {
      carregar();
      setMostrarModal(false);
      setPosting(false);
      setSpinner(false);
    });
  }

  function submitLogin(e) {
    setSpinner(true);
    e.preventDefault();
    login(email, senha).then((a) => {
      setLogado(a);
      setSpinner(false);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Olá {usuario.username}</p>
        <form className="form-pesquisa_titulo" onSubmit={pesquisarImages}>
          <input
            type="text"
            id="pesquisa"
            placeholder="Pesquisar"
            onChange={(e) => setPesquisa(e.target.value)}
          ></input>
        </form>
        <button
          className="form-pesquisa_submit"
          onClick={(e) => {
            e.preventDefault();
            setMostrarModal(true);
          }}
        >
          Adicionar Imagem
        </button>
      </header>
      {!logado ? (
        <form onSubmit={submitLogin} className="form-login">
          <input
            type="email"
            className="input-email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
          <input
            type="password"
            className="input-senha"
            onChange={(e) => {
              setSenha(e.target.value);
            }}
          ></input>
          <button type="submit" className="form-loguin_submit">
            Entrar
          </button>
        </form>
      ) : null}
      <main>
        {spinner ? (
          <div className="div-spinner">
            <ImSpinner9 className="spinner" />
          </div>
        ) : null}
        {mostrarModal ? (
          <div className="modal">
            <form className="modal-form" onSubmit={submitImage}>
              <AiOutlineCloseCircle
                onClick={() => setMostrarModal(false)}
                className="sairModal"
              />
              <label htmlFor="title">Titulo</label>
              <input type="text" id="title" name="title" />
              <label htmlFor="description">Descrição</label>
              <textarea
                name="description"
                id="description"
                cols="20"
                rows="10"
                maxLength={200}
              ></textarea>
              <label htmlFor="tag_id">Tag</label>
              <select name="tag_id" id="tag_id">
                <option value="" disabled>
                  Selecione
                </option>
                {tags.map((tgs) => {
                  return <option value={tgs.id}>{tgs.name}</option>;
                })}
              </select>
              <label htmlFor="file">Imagem</label>
              <input type="file" id="file" name="file" />
              <button type="submit" disabled={posting}>
                Enviar
              </button>
            </form>
          </div>
        ) : null}
        <div>
          {images1.map((image) => {
            return (
              <div className="imagens-pai">
                <img src={image.path} className="imagens"></img>
                <span>
                  {image.owner.id == usuario.id ? (
                    <button
                      className="imagens-span_deletar"
                      onClick={(e) => {
                        e.preventDefault();
                        setSpinner(true);
                        deleteImage(image.id).then((e) => {
                          if (e) {
                            carregar();
                          }
                        });
                      }}
                    >
                      Deletar
                    </button>
                  ) : null}
                </span>
                <span>
                  <p className="imagens_titulo">{image.title}</p>
                  <p className="imagens_descricao">{image.description}</p>
                </span>
              </div>
            );
          })}
        </div>
        <div>
          {images2.map((image) => {
            return (
              <div className="imagens-pai">
                <img src={image.path} className="imagens"></img>
                <span>
                  {image.owner.id == usuario.id ? (
                    <button
                      className="imagens-span_deletar"
                      onClick={(e) => {
                        e.preventDefault();
                        setSpinner(true);
                        deleteImage(image.id).then((e) => {
                          if (e) {
                            carregar();
                          }
                        });
                      }}
                    >
                      Deletar
                    </button>
                  ) : null}
                </span>
                <span>
                  <p className="imagens_titulo">{image.title}</p>
                  <p className="imagens_descricao">{image.description}</p>
                </span>
              </div>
            );
          })}
        </div>
        <div>
          {images3.map((image) => {
            return (
              <div className="imagens-pai">
                <img src={image.path} className="imagens"></img>
                <span>
                  {image.owner.id == usuario.id ? (
                    <button
                      className="imagens-span_deletar"
                      onClick={(e) => {
                        e.preventDefault();
                        setSpinner(true);
                        deleteImage(image.id).then((e) => {
                          if (e) {
                            carregar();
                          }
                        });
                      }}
                    >
                      Deletar
                    </button>
                  ) : null}
                </span>
                <span>
                  <p className="imagens-titulo">{image.title}</p>
                  <p className="imagens-descricao">{image.description}</p>
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
