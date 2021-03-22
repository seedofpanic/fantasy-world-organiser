import React from "react";
import TreeView from "@material-ui/lab/TreeView";
import { makeStyles } from "@material-ui/core/styles";
import { observer } from "mobx-react-lite";
import { store } from "../store/store";
import RegionListItem from "./region-list-item";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteConfirmationDialog from "./delete-confirmation-dialog";
import { Button } from "@material-ui/core";
import { Region } from "../store/region";

const useStyles = makeStyles({
  root: {
    height: "100%",
    flexGrow: 1,
    maxWidth: 400,
    "overflow-y": "scroll",
    "overflow-x": "hidden",
  },
  paper: {
    width: "80%",
    maxHeight: 435,
  },
  addButton: {
    margin: "auto",
    marginBottom: 20,
  },
  actions: {
    flex: "0 0 auto",
  },
});

function addRegion() {
  store.rootRegion?.addChild(new Region());
}

function RegionsList() {
  const classes = useStyles();

  return (
    <>
      <div className={classes.actions}>
        <Button
          className={classes.addButton}
          color="primary"
          variant="contained"
          onClick={addRegion}
        >
          Add Region
        </Button>
      </div>
      <TreeView
        className={classes.root}
        defaultExpanded={[]}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultEndIcon={<div />}
      >
        {store.rootRegion ? (
          <RegionListItem region={store.rootRegion} path="" />
        ) : (
          ""
        )}
      </TreeView>
      <DeleteConfirmationDialog
        classes={{
          paper: classes.paper,
        }}
        id="ringtone-menu"
        keepMounted
        onClose={handleClose}
        open={store.regionDeletion?.isOpen}
        toDeleteName={store.regionDeletion?.region?.name}
      />
    </>
  );
}

function handleClose(result: boolean) {
  if (result) {
    store.commitRegionDeletion();
  }

  store.setRegionDeletion(false);
}

export default observer(RegionsList);
