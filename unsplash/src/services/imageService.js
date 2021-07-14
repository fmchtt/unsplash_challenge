import api from "./api";

export function getImages() {
  return api.get("images/");
}

export async function deleteImage(id) {
  const deletar = await api.delete(`images/${id}/`);
  return true;
}

export async function postImage(form) {
  const post = await api.post("images/", form);
  return post.data;
}

export async function getPesquisaImages(s) {
  const pesquisa = await api.get(`images/?p=${s}`);
  return pesquisa.data;
}
