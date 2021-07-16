import { useEffect, useState } from "react";
import {
  deleteImage,
  getImages,
  getPesquisaImages,
} from "./services/imageService";
import { login, getLogado } from "./services/loginService";
import { AiOutlineClose } from "react-icons/ai";
import { ImSpinner9 } from "react-icons/im";
import ImageCard from "./components/ImageCard";
import ImagesCreateModal from "./components/ImageCreateModal";
import { putAvatar } from "./services/usuarioService";

function App() {
  const [images1, setImages1] = useState([]);
  const [images2, setImages2] = useState([]);
  const [images3, setImages3] = useState([]);
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [logado, setLogado] = useState(false);
  const [logar, setLogar] = useState(false);
  const [usuario, setUsuario] = useState({ id: 0, username: "Anônimo" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pesquisa, setPesquisa] = useState();
  const [spinner, setSpinner] = useState(true);
  const [deletar, setDeletar] = useState(false);
  const [idImagem, setIdImagem] = useState();
  const [modalImagem, setModalImagem] = useState(false);
  const [pathImagem, setPathImagem] = useState();
  const [erroLogin, setErroLogin] = useState();

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
      getLogado().then((log) => {
        setUsuario(log);
      });
      setLogado(true);
    }
  }, []);

  function submitLogin(e) {
    e.preventDefault();
    if (email && senha) {
      setSpinner(true);
      login(email, senha)
        .then((a) => {
          setLogado(a);
          setLogar(false);
          setErroLogin("");
          getLogado().then((log) => {
            setUsuario(log);
            setSpinner(false);
          });
        })
        .catch((e) => {
          console.dir(e);
          setErroLogin(e.response.data.detail);
          setSpinner(false);
        });
    } else {
      setErroLogin("Email ou Senha não preenchidos");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="div-avatar">
          <div className="overlay-avatar">
            {logado ? (
              <form>
                <label className="mudar-avatar" htmlFor="avatar-input">
                  <p>Mudar Avatar</p>
                </label>
                <input
                  type="file"
                  id="avatar-input"
                  onInput={(e) => {
                    e.preventDefault();
                    setSpinner(true);
                    let data = new FormData();
                    data.append("file", e.target.files[0]);
                    putAvatar(data)
                      .then((e) => {
                        setUsuario(e);
                        carregar();
                      })
                      .catch(() => {
                        setSpinner(false);
                      });
                  }}
                ></input>
              </form>
            ) : null}
            <img
              src={
                usuario.avatar_url
                  ? usuario.avatar_url
                  : "https://via.placeholder.com/75"
              }
              className="avatar"
            ></img>
          </div>
          <p>Olá {usuario.username}</p>
        </div>
        <form className="form-pesquisa_titulo" onSubmit={pesquisarImages}>
          <input
            type="text"
            id="pesquisa"
            placeholder="Pesquisar"
            onChange={(e) => setPesquisa(e.target.value)}
          ></input>
        </form>
        {logado ? (
          <div className="div-logado">
            <button
              className="form-pesquisa_submit"
              onClick={(e) => {
                e.preventDefault();
                setMostrarModal(true);
              }}
            >
              Adicionar Imagem
            </button>
            <button
              className="button-deslogar"
              onClick={() => {
                localStorage.removeItem("token");
                setLogado(false);
                setUsuario({ id: 0, username: "Anônimo" });
              }}
            >
              Deslogar
            </button>
          </div>
        ) : (
          <button
            className="logar-submit"
            onClick={(e) => {
              e.preventDefault();
              setLogar(true);
            }}
          >
            Logar
          </button>
        )}
      </header>
      {logar ? (
        <div className="div-login">
          <AiOutlineClose
            onClick={() => setLogar(false)}
            className="login-close"
          />
          <form onSubmit={submitLogin} className="form-login">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="input-email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              className="input-senha"
              onChange={(e) => {
                setSenha(e.target.value);
              }}
            ></input>
            {erroLogin ? <p>{erroLogin}</p> : null}
            <button type="submit" className="form-loguin_submit">
              Entrar
            </button>
          </form>
        </div>
      ) : null}
      <main>
        {spinner ? (
          <div className="div-spinner">
            <ImSpinner9 className="spinner" />
          </div>
        ) : null}
        <ImagesCreateModal
          onError={() => {
            setSpinner(false);
          }}
          visible={mostrarModal}
          onSubmit={() => {
            setSpinner(true);
          }}
          finishSubmit={() => {
            setSpinner(false);
            setMostrarModal(false);
            carregar();
          }}
          clickClose={() => {
            setMostrarModal(false);
          }}
        />
        {deletar ? (
          <div className="modal-deletar">
            <AiOutlineClose
              className="md-fechar"
              onClick={() => {
                setDeletar(false);
              }}
            />
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
        ) : null}
        {modalImagem ? (
          <div className="fundo-imagem">
            <AiOutlineClose
              className="modal-imagem-exit"
              onClick={() => {
                setModalImagem(false);
              }}
            />
            <div className="modal-imagem">
              <img src={pathImagem} className="imagens"></img>
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
                  setIdImagem(image.id);
                  setPathImagem(image.path);
                  setModalImagem(true);
                }}
                showDelete={image.owner.id == usuario.id}
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
                  setIdImagem(image.id);
                  setPathImagem(image.path);
                  setModalImagem(true);
                }}
                showDelete={image.owner.id == usuario.id}
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
                  setIdImagem(image.id);
                  setPathImagem(image.path);
                  setModalImagem(true);
                }}
                showDelete={image.owner.id == usuario.id}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
