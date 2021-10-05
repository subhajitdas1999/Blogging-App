import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import "./Postview.css";
import moment from "moment";
import Avatar from "@material-ui/core/Avatar";

function Postview({ match }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    db.collection("global")
      .doc(match.params.id)
      .get()
      .then((doc) => {
        setData(doc.data());
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [match.params.id]);

  return (
    <div className="postview">
      {loading ? (
        <h1 className="postview__loading">Loading...</h1>
      ) : (
        <div className="postview__container">
          <div className="postview__heading">{data.title}</div>
          <div className="postview__profile__details">
            <Avatar src={data.photoURL} />
            <div className="postview__profile__info">
              <p className="postview__profile__name">{data.displayName}</p>
                <p>{moment(new Date(data?.timestamp?.toDate()),"YYYYMMDD").format("ll")}</p>
              </div>
          </div>
          <div className="postview__img" style={{display : data.imgURL?"block":"none"}}>
            <img src={data.imgURL} alt="image" />
          </div>
          <div className="postview__content">{data.content}</div>
        </div>
      )}
    </div>
  );
}

export default Postview;

