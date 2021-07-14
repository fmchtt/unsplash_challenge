import api from "./api";

export async function getTags() {
  const tags = await api.get("tags/", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return tags.data;
}
