import api from "./api";

export async function login(userName, password) {
  const response = await api.post(
    "login",
    new URLSearchParams({ username: userName, password: password }),
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );
  if (response.data.access_token) {
    await localStorage.setItem("token", response.data.access_token);
    return true;
  }
}

export async function getLogado(){
    const logado = await api.get("users/me", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    return logado.data
}
