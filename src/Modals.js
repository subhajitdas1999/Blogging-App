import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { modalContext } from "./App";
import Modal from "@material-ui/core/Modal";
import "./Modals.css";
import Button from "@material-ui/core/Button";
import {logIn} from "./Auth"
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "fit-content",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    fontFamily: "Lato",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(1, 2, 2),
  },
}));

function Modals() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [modalOpen, setModalOpen] = useContext(modalContext);

  return (
    <div>
      <Modal
        // disableBackdropClick
        open={modalOpen.logIn}
        onClose={() =>
          setModalOpen((prev) => ({
            ...prev,
            ["logIn"]: false,
          }))
        }
      >
        <div style={modalStyle} className={classes.paper}>
          <div className="Modals__logIn">
            <h2>You need to log In</h2>
            <Button variant="contained" color="primary" onClick={logIn}>
              LogIn
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={modalOpen.uploading}>
        <div style={modalStyle} className={classes.paper}>
          <div className="Modals__uploding">
            <h2>Uploading...</h2>
            <progress max="100" value={modalOpen.uploadProgress}></progress>
            <p>
              {modalOpen.uploadProgress}
              <span>%</span>
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Modals;

// modalOpen.uploadProgress
