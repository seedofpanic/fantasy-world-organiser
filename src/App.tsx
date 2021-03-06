import React from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import RegionsList from "./components/regions-list";
import { store } from "./store/store";
import { observer } from "mobx-react-lite";
import RegionInfo from "./components/region-info";
import { Region } from "./store/region";
import { Place } from "./store/place";
import PlaceInfo from "./components/place-info";
import DeleteConfirmationDialog from "./components/delete-confirmation-dialog";
import { saveCurrentProject } from "./store/save-load";

const useStyles = makeStyles({
  app: {
    display: "flex",
    "flex-direction": "row",
  },
  regionsList: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: "0 1 400px",
    padding: "30px",
    "box-sizing": "border-box",
  },
  info: {
    flex: "1 1",
    padding: "30px",
    "background-color": "#f5f5f5",
  },
  paper: {
    width: "80%",
    maxHeight: 435,
  },
});

function handleClose(result: boolean) {
  if (result) {
    saveCurrentProject(() => {
      store.appQuit.setAppQuit(false, true);
    });

    return;
  }

  store.appQuit.setAppQuit(false, true);
}
function handleCloseCharacterDelete(result: boolean) {
  if (result) {
    store.characterDeletion.commitCharacterDeletion();
  }
  store.characterDeletion.setCharacterDeletion(false);
}

function App() {
  const classes = useStyles();

  function getInfoComponent(region: Region | Place) {
    if (region instanceof Region) {
      return <RegionInfo region={region} />;
    }

    return <PlaceInfo place={region} />;
  }

  return (
    <>
      {store.fileName ? (
        <div className={"App " + classes.app}>
          <div className={classes.regionsList}>
            <RegionsList />
          </div>
          <div className={classes.info}>
            {store.selectedRegion ? getInfoComponent(store.selectedRegion) : ""}
          </div>
        </div>
      ) : (
        <h1>No project loaded. Please create a new one with File/New</h1>
      )}
      <DeleteConfirmationDialog
        classes={{
          paper: classes.paper,
        }}
        id="ringtone-menu"
        keepMounted
        onClose={handleClose}
        open={store.appQuit.isOpen}
        title="Do you want to save changes before exit?"
      />
      <DeleteConfirmationDialog
        classes={{
          paper: classes.paper,
        }}
        id="ringtone-menu"
        keepMounted
        onClose={handleCloseCharacterDelete}
        open={store.characterDeletion?.isOpen}
        toDeleteName={store.characterDeletion?.character?.name}
      />
    </>
  );
}

export default observer(App);
