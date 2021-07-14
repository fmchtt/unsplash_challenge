import api from "./api"

export async function getTags(){
    const tags = await api.get("tags/")
    return tags.data
}
