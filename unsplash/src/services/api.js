import axios from "axios";

const api = axios.create({
  baseURL: "http://179.250.201.109:3000/api/",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
});

export default api;
