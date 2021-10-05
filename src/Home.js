import React, { useContext } from "react";
import "./Home.css";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import Blog_Preview from "./Blog_Preview";
import { postContext, modalContext } from "./App";
// import Modals from "./Modals";
import Tooltip from "@material-ui/core/Tooltip";

function Home() {
  const [posts, setPosts] = useContext(postContext);
  // const [modalOpen, setModalOpen] = useContext(modalContext);
  return (
    <div className="home">
      <div className="home_blog_preview">
        {posts.map((post) => (
          <Blog_Preview key={post.id} post={post} Isprofile={false} />
        ))}
      </div>

      <Link to="/writeblog">
        <Tooltip title="Create">
          <AddIcon className="home__createIcon" />
        </Tooltip>
      </Link>
    </div>
  );
}

export default Home;
