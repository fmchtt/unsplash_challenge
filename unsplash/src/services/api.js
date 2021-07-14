import axios from "axios";

const api = axios.create({
  baseURL: "http://179.250.201.109:3000/api/",
});

export default api;
