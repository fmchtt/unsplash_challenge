import { useEffect, useState } from "react";
import { postImage } from "../services/imageService";
import { getTags } from "../services/tagService";
import { AiOutlineClose } from "react-icons/ai";

const ImagesCreateModal = (props) => {
  const [tags, setTags] = useState([]);
  const [erro, setErro] = useState();

  useEffect(() => {
    getTags().then((tags) => {
      setTags(tags);
    });
  }, []);

  function submitImage(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    if (data.get("title") != "") {
      if (data.get("tag_id") != "") {
        if (data.get("file").name) {
          props.onSubmit();
          postImage(data).then(() => {
            props.finishSubmit();
          });
          setErro();
        } else {
          setErro("Escolha um arquivo");
          props.onError();
        }
      } else {
        setErro("Escolha uma Tag");
        props.onError();
      }
    } else {
      setErro("Coloque um título");
      props.onError();
    }
  }

  if (props.visible) {
    return (
      <div className="modal">
        <AiOutlineClose onClick={props.clickClose} className="sairModal" />
        <form className="modal-form" onSubmit={submitImage}>
          <label htmlFor="title">Titulo</label>
          <input type="text" id="title" name="title" />
          <label htmlFor="description">Descrição</label>
          <textarea
            name="description"
            id="description"
            cols="20"
            rows="10"
            maxLength={200}
          ></textarea>
          <label htmlFor="tag_id">Tag</label>
          <select name="tag_id" id="tag_id">
            <option value="">Selecione</option>
            {tags.map((tag) => {
              return (
                <option key={tag.name + tag.id} value={tag.id}>
                  {tag.name}
                </option>
              );
            })}
          </select>
          <label htmlFor="file">Imagem</label>
          <input type="file" id="file" name="file" />
          <button type="submit">Enviar</button>
          {erro ? <p>{erro}</p> : null}
        </form>
      </div>
    );
  } else {
    return null;
  }
};

export default ImagesCreateModal;
