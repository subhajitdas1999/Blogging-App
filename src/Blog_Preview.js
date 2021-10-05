import React, { useContext, useState } from "react";
import "./Blog_Preview.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { userContext,forDocEditContext } from "./App";
import { db } from "./firebase";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
// import ModeEditIcon from "@mui/icons-material/ModeEdit";
import EditIcon from "@material-ui/icons/Edit";
// import { Link } from "react-router-dom";

function Blog_Preview({ post, Isprofile }) {
  const [user, setUser] = useContext(userContext);
  const [forEditDocId,setForEditDocId] = useContext(forDocEditContext);

  //For Edit
  function handleEdit(){
    setForEditDocId({id:post.id});
  }

  //Delete post
  function deletePost() {
    // console.log("hallo", post.id, user.uid);
    db.collection(user.uid)
      .doc(post.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });

    db.collection("global")
      .doc(post.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }
  return (
    <div className="blog_preview">
      <Link
        to={`/blog/${post.id}`}
        style={{ textDecoration: "none", color: "black" }}
      >
        <div className="blog_preview__details">
          <div className="blog_preview__details__text">
            <h2>{post.data.title}</h2>
            <p>{post.data.content}</p>
          </div>
          <div
            className="blog_preview__details__img"
            style={{
              backgroundImage: `url(${post.data.imgURL})`,
              display: post.data.imgURL ? "block" : "none",
            }}
          />
        </div>
      </Link>
      <div className="blog_preview__info">
        <div className="blog_preview__info__time">
          <span>
            {moment(
              new Date(post.data?.timestamp?.toDate()),
              "YYYYMMDD"
            ).fromNow()}
          </span>
        </div>
        {Isprofile && (
          <Link to="/writeblog" className="blog_preview__info__link">
          <div className="blog_preview__info__btn" onClick={handleEdit}>
            
              <Tooltip title="Edit">
                <EditIcon />
              </Tooltip>
            
          </div>
          </Link>
        )}
        {Isprofile && (
          <div className="blog_preview__info__btn" onClick={deletePost}>
            <Tooltip title="Delete">
              <DeleteIcon />
            </Tooltip>
          </div>
        )}
        <div className="blog_preview__info__author">
          {post.data.displayName}
        </div>
      </div>
    </div>
  );
}

export default Blog_Preview;
