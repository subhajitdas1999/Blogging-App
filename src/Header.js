import React, { useEffect, useState, useContext } from "react";
import "./Header.css";
import MenuIcon from "@material-ui/icons/Menu";
import ClearIcon from "@material-ui/icons/Clear";
import Avatar from "@material-ui/core/Avatar";
import { Link , useLocation} from "react-router-dom";
import { userContext } from "./App";

import firebase from "firebase";
import { logIn, logOut } from "./Auth";
import Logo from "./logo.png";
import RateReviewOutlinedIcon from '@material-ui/icons/RateReviewOutlined';

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useContext(userContext);
  const location = useLocation()
  // console.log(useLocation().pathname);
  useEffect(() => {
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
       
        setUser({
          user: true,
          name: user.displayName,
          displayimgURL: user.photoURL,
          uid:user.uid
        });
      } else {
        setUser({
          user: false,
          name: "",
          displayimgURL: "",
          uid:""
        });
      }
    });
  }, []);

  // to stop scrolling when the nav is active
  (navOpen ?  document.querySelector("body").classList.add("nav_active"): document.querySelector("body").classList.remove("nav_active"));
         
         

  return (
    <div className="header">
      <Link
        to="/"
        className="header__link logo"
        onClick={() => setNavOpen(false)}
      >
        <div className="header__logo"><RateReviewOutlinedIcon className="logo"/></div>
      </Link>
      <nav className={navOpen ? "header__nav active" : "header__nav"}>
        <ul className="header__ul">
          <Link
            to={user.user?`/profile/${user.name}/${user.uid}`:"/profile/none/404"}
            className="header__link"
            onClick={() => setNavOpen(false)}
          >
            <li>Your Posts</li>
          </Link>
          {user.user ? (
            <Link className="header__link left">
              <li className="header__userInfo" onClick={logOut}>
                <Avatar alt="Image" src={user.displayimgURL}  className="profile__avatar"/>
                <p>{user.name}</p>
              </li>
            </Link>
          ) : (
            <Link className="header__link left" onClick={logIn}>
              <li>login</li>
            </Link>
          )}
        </ul>
      </nav>
      <div
        className="header__menu-toggle"
        onClick={() => {
          setNavOpen(!navOpen);
        }}
      >
        {navOpen ? <ClearIcon /> : <MenuIcon />}
      </div>
    </div>
  );
}

export default Header;
