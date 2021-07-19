import api from "./api";

export async function getTags() {
  const tags = await api.get("tags/", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return tags.data;
}

export async function postTagImagem(imgId, tagId) {
  const tagImg = await api.post(
    `tags/add/${imgId}/tag/${tagId}/`,
    {},
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  return tagImg.data;
}

export async function deletarTag(imgId, tagId) {
  const tagImg = await api.delete(`tags/remove/${imgId}/tag/${tagId}/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return tagImg.data;
}
