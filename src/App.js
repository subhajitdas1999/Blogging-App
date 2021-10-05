import React, { useState,useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import WriteBlog from "./WriteBlog";
import Postview from "./Postview";
import Profile from "./Profile";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {auth , db} from "./firebase";
import { createContext } from "react";


// import firebase from "firebase";

// AIzaSyB0tPIh99Rwqr6PfBdv60gwfS_s1nxC7x4

const userContext = createContext();
const postContext = createContext();
const modalContext = createContext();
const forDocEditContext = createContext();

function App() {
  const [user, setUser] = useState({
    user: false,
    name: "",
    displayimgURL: "",
    uid:""
  });

  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState({
    logIn:false,
    uploading:false,
    uploadProgress:0
  });
  const [forEditDocId, setForEditDocId] = useState({
    id:null
  });

  useEffect(() => {
    db.collection("global").orderBy("timestamp","desc").onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc =>({ 
        id:doc.id,
        data:doc.data()
      })));  
    });
  }, [])



  return (
    <userContext.Provider value={[user, setUser]}>
      <postContext.Provider value={[posts, setPosts]}>
        <modalContext.Provider value={[modalOpen, setModalOpen]}>
          <forDocEditContext.Provider value={[forEditDocId,setForEditDocId]}>
        <Router>
          <div className="App">
            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/writeblog"  component={WriteBlog} />
              <Route path="/blog/:id"  component={Postview} />
              <Route path="/profile/:name/:id"  component={Profile} />
            </Switch>
          </div>
        </Router>
        </forDocEditContext.Provider>
        </modalContext.Provider>
      </postContext.Provider>
    </userContext.Provider>
  );
}

export default App;
export { userContext ,postContext ,modalContext,forDocEditContext };
