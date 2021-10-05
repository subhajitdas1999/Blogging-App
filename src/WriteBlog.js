import React, { useContext, useEffect, useState } from "react";
import "./WriteBlog.css";
import { userContext, modalContext, forDocEditContext } from "./App";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import DoneIcon from "@material-ui/icons/Done";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
// import { makeStyles } from "@material-ui/core";
import { auth, db, storage } from "./firebase";
import Modals from "./Modals";
import { Link } from "react-router-dom";
import firebase from "firebase";

function WriteBlog() {
  // alert(s);

  const [user, setUser] = useContext(userContext);
  const [modalOpen, setModalOpen] = useContext(modalContext);
  const [forEditDocId, setForEditDocId] = useContext(forDocEditContext);

  const [updateblog, setUpdateBlog] = useState({
    docId:null,
    updateFlag:false
  })
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    imgURL: "",
  });

  const [image, setImage] = useState({
    Img: null,
    previewURL: "",
    uploaded: false,
  });

  // https://picsum.photos/id/400/600/700

  useEffect(() => {
    //set the modal true so that it can open even after closing it

    if (user.user) {
      setModalOpen((prev) => ({
        ...prev,
        ["logIn"]: false,
      }));
      if (forEditDocId.id != null) {
        
        db.collection(user.uid)
          .doc(forEditDocId.id)
          .get()
          .then((doc) =>{
            setBlog({ title: doc.data().title, content: doc.data().content,imgURL:doc.data().imgURL})
            if (doc.data().imgURL){
              setImage(prev =>({
                ...prev,
                ["previewURL"]:doc.data().imgURL,
                ["uploaded"]:true
              }))
            }
            }
            
          );

          setUpdateBlog({
            docId:forEditDocId.id,
            updateFlag:true
          })
          setForEditDocId({id:null});
          
      }
    } else {
      setModalOpen((prev) => ({
        ...prev,
        ["logIn"]: true,
      }));
    }
  }, [user.user]);

  function handleChange(e) {
    setBlog((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function fileSelectedHandler(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      // console.log(result);
      setImage((prev) => ({
        ...prev,
        ["previewURL"]: result,
      }));
    };
    if (file) {
      setImage((prev) => ({
        ...prev,
        ["Img"]: file,
        ["uploaded"]:false
      }));
      reader.readAsDataURL(file);
    }
  }

  function uploadImage() {
    //Upload Image to the database and set the url
    const uploadTask = storage
      .ref(`blog_images/${image.Img.name}`)
      .put(image.Img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //do something with uploading
        var percentage =
          Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setModalOpen((prev) => ({
          ...prev,
          ["uploading"]: true,
          ["uploadProgress"]: percentage,
        }));
      },
      (error) => {
        console.log(error);
      },

      () => {
        //done uploading and set imageurl to the blog
        // console.log("uplaoded")
        storage
          .ref("blog_images")
          .child(image.Img.name)
          .getDownloadURL()
          .then((url) => {
            // console.log("database", url);
            setBlog((prev) => ({
              ...prev,
              ["imgURL"]: url,
            }));
          });
        setModalOpen((prev) => ({
          ...prev,
          ["uploading"]: false,
        }));

        setImage((prev) => ({
          ...prev,
          ["uploaded"]: true,
        }));
      }
    );
  }

  function addToDatabase() {
    if (updateblog.updateFlag){
      db.collection("global").doc(updateblog.docId).update(blog);
      db.collection(user.uid).doc(updateblog.docId).update(blog);
      setUpdateBlog({updateFlag:false});
    }

    else{
    //get the doc id from gloabl colections to use it for easily fetching data later

    // console.log("yes");
    db.collection("global")
      .add({
        ...blog,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        // add data to user collection
        // console.log(`Document successfully written 1! ${doc.id}`);
        db.collection(auth.currentUser.uid)
          .doc(doc.id)
          .set({
            ...blog,
            displayName: auth.currentUser.displayName,
            photoURL: auth.currentUser.photoURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            setBlog({
              title: "",
              content: "",
              imgURL: "",
            });

            setImage({ Img: null, previewURL: "" });
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
    }

    setForEditDocId({id:null})
  }

  return !user.user ? (
    <Modals />
  ) : (
    <div className="writeBlog">
      <Modals />
      <div className="writeBlog__div">
        <TextareaAutosize
          name="title"
          aria-label="empty textarea"
          placeholder="title..."
          value={blog.title}
          className="writeBlog__textarea title"
          onChange={handleChange}
        />
      </div>

      <div className="writeBlog__div">
        <TextareaAutosize
          name="content"
          aria-label="empty textarea"
          placeholder="Content..."
          value={blog.content}
          className="writeBlog__textarea content"
          onChange={handleChange}
        />
      </div>
      <div className="writeBlog__imagePreview">
        <img src={image.previewURL} alt="" />
      </div>
      <div className="writeBlog__icons">
        <div className="Icon_addimage">
          {image.Img ? (
            <Tooltip title="remove image">
              <DeleteIcon
                onClick={() =>{
                  setBlog(prev => ({
                    ...prev,
                    ["imgURL"]:""
                  }))
                  setImage({ Img: null, previewURL: "", uploaded: false })
                }
                }
              />
            </Tooltip>
          ) : (
            <label htmlFor="input-image">
              <Tooltip title="Add Image">
                <AddAPhotoIcon style={{ cursor: "pointer" }} />
              </Tooltip>
            </label>
          )}
          <input
            type="file"
            id="input-image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={fileSelectedHandler}
          />
        </div>

        {image.uploaded ? (
          <Tooltip title="uploaded">
            <CloudDoneIcon className="uploadDone__Icon" />
          </Tooltip>
        ) : (
          <div
            className="Icon__upload"
            style={{ display: image.Img ? "block" : "none" }}
          >
            <Tooltip title="upload">
              <ArrowUpwardIcon onClick={uploadImage} />
            </Tooltip>
          </div>
        )}
        <Link to="/" style={{ color: "grey" }}>
          <Tooltip title="Publish">
            <DoneIcon onClick={addToDatabase} />
          </Tooltip>
        </Link>
      </div>
    </div>
  );
}

export default WriteBlog;
