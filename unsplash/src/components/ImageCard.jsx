import { AiFillHeart } from "react-icons/ai";

const ImageCard = (props) => {
  return (
    <div className="imagens-pai">
      <img
        src={props.image.path}
        className="imagens"
        onClick={props.onClick}
        alt={props.image.title}
      />
      {localStorage.getItem("token") ? (
        <AiFillHeart
          className={
            props.image.user_liked ? "coracao-like vermelho" : "coracao-like"
          }
          onClick={props.onLikeClick}
        />
      ) : null}
      <div className="info">
        {props.showDelete ? (
          <button
            className="imagens-span_deletar"
            onClick={(e) => {
              e.preventDefault();
              props.clickDelete(props.image.id);
            }}
          >
            Deletar
          </button>
        ) : null}

        <div className="overlay-detail">
          {props.avatar ? (
            <img
              alt="avatar"
              src={
                props.image.owner.avatar_url
                  ? props.image.owner.avatar_url
                  : "https://via.placeholder.com/150"
              }
              onClick={props.avatarClick}
            />
          ) : null}
          <div>
            <p className="imagens-titulo" onClick={props.onClick}>
              {props.image.title}
            </p>
            <p className="imagens-descricao" onClick={props.onClick}>
              {props.image.description
                ? props.image.description.length > 45
                  ? props.image.description.substring(0, 45) + "..."
                  : props.image.description
                : null}
            </p>
            <div className="tags">
              {props.avatar
                ? props.image.tags.map((tag, indice) => {
                    if (indice < 2) {
                      return (
                        <span
                          key={tag.name + tag.id}
                          onClick={() => {
                            props.tagClick(tag.id);
                          }}
                        >
                          {tag.name}
                        </span>
                      );
                    }
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
