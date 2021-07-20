import api from "./api";

function getHeader() {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };
}

export function getImages() {
  return api.get("images/");
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
