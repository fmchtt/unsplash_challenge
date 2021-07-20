import api from "./api";

function getHeader() {
  if (localStorage.getItem("token")) {
    return {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
  } else {
    return {};
  }
}

export async function getImages() {
  const imagens = await api.get("images/", getHeader());
  return imagens.data;
}

export async function deleteImage(id) {
  await api.delete(`images/${id}/`, getHeader());
  return true;
}

export async function pegarImagem(id) {
  const pegarImg = await api.get(`images/${id}`, getHeader());
  return pegarImg.data;
}

export async function alterarImagem(id, titulo, descricao) {
  const alterarImagem = await api.put(
    `images/${id}/`,
    { title: titulo, description: descricao },
    getHeader()
  );
  return alterarImagem.data;
}

export async function postImage(form) {
  const post = await api.post("images/", form, getHeader());
  return post.data;
}

export async function getPesquisaImages(s) {
  const pesquisa = await api.get(`images/?p=${s}`, getHeader());
  return pesquisa.data;
}

export async function darLike(id) {
  const like = await api.get(`images/like/${id}`, getHeader());
  return like.data;
}
