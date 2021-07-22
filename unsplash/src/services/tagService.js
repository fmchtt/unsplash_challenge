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

export async function getTags() {
  const tags = await api.get("tags/");
  return tags.data;
}

export async function postTagImagem(imgId, tagId) {
  const tagImg = await api.post(`tags/add/${imgId}/tag/${tagId}/`, getHeader());
  return tagImg.data;
}

export async function buscarTag(tagID) {
  const tag = await api.get(`tags/${tagID}`, getHeader());
  return tag.data;
}

export async function deletarTag(imgId, tagId) {
  const tagImg = await api.delete(
    `tags/remove/${imgId}/tag/${tagId}/`,
    getHeader()
  );
  return tagImg.data;
}
