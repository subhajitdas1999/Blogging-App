import React, { useEffect, useState } from "react";
import { useContext } from "react";
import "./Profile.css";
import { userContext, modalContext } from "./App";
import { db } from "./firebase";
import Blog_Preview from "./Blog_Preview";
import Modals from "./Modals";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

function Profile() {
  const [user, setUser] = useContext(userContext);
  const [modalOpen, setModalOpen] = useContext(modalContext);
  const [userposts, setUserposts] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (user.user) {
      db.collection(user.uid)
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setUserposts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data()
            }))
          );
          setloading(false);
        });
    } else {
      setModalOpen((prev) => ({
        ...prev,
        ["logIn"]: true
      }));
    }
  }, [user.user]);

  return !user.user ? (
    <Modals />
  ) : (
    <div className="profile">
      {loading ? (
        <h1 className="profile__loading">Loading...</h1>
      ) : (
        <div className="profile__container">
          <h2 className="profile__container__heading">
            You have {userposts.length} posts
          </h2>

          {userposts.map((userpost) => (
            <Blog_Preview key={userpost.id} post={userpost} Isprofile={true} />
          ))}
          <Link to="/writeblog">
            <Tooltip title="Create">
              <AddIcon className="home__createIcon" />
            </Tooltip>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Profile;
