import { useEffect } from "react";

const ImageCard = (props) => {
  return (
    <div className="imagens-pai" key={props.image.key}>
      <img src={props.image.path} className="imagens" onClick={props.onClick} />
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
        <div onClick={props.onClick} className="overlay-detail">
          <img
            src={
              props.image.owner.avatar_url
                ? props.image.owner.avatar_url
                : "https://via.placeholder.com/150"
            }
          />
          <div>
            <p className="imagens-titulo">{props.image.title}</p>
            <p className="imagens-descricao">{props.image.description}</p>
            <div className="tags">
              {props.image.tags.map((tag) => {
                return <span>{tag.name}</span>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
