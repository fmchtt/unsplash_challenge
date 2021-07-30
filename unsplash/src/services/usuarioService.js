import api from "./api";

export async function putAvatar(arquivo) {
  const novoAvatar = await api.put("users/avatar/", arquivo, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return novoAvatar.data;
}

export async function criarUsuario(usuario, email, senha) {
  const novoUsuario = await api.post(
    "users/",
    { username: usuario, email: email, password: senha },
    {}
  );
  return novoUsuario.data;
}

export async function buscarUsuario(id) {
  const usuario = await api.get(`users/${id}/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return usuario.data;
}
