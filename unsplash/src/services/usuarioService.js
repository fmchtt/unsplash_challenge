import api from "./api";

export async function putAvatar(arquivo) {
  const novoAvatar = await api.put("users/avatar/", arquivo, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return novoAvatar.data
}
