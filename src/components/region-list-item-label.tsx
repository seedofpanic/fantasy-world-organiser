import { observer } from "mobx-react-lite";
import { Region } from "../store/region";
import { Place } from "../store/place";
import React, { DragEvent } from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import { Add, Close } from "@material-ui/icons";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import IconButton from "@material-ui/core/IconButton";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { createStyles, Theme } from "@material-ui/core";
import { store } from "../store/store";

const useLabelStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px 0",
    },
    name: {
      flex: "1 1 auto",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    actions: {
      position: "relative",
      display: "flex",
      flex: "0 0 auto",
      flexDirection: "row",
      marginLeft: 20,
    },
    speedDial: {
      right: "100%",
      top: -16,
      position: "absolute",
    },
    action: {
      backgroundColor: "red",
      color: "white",
    },
  })
);

const speedDialStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      width: 20,
      height: 20,
      minHeight: 20,
      marginTop: 5,
      alignItems: "flex-start",
    },
  })
);

function allowDrop(ev: DragEvent, region: Region | Place) {
  if (region instanceof Place) {
    store.characterMovement.setToPlace(region);
  }
  ev.preventDefault();
}

function onDragLeave() {
  store.characterMovement.setToPlace(undefined);
}

function onDrop(ev: DragEvent, region: Region | Place) {
  if (region instanceof Place && store.characterMovement.draggedCharacter) {
    store.characterMovement.fromPlace?.removeCharacter(
      store.characterMovement.draggedCharacter
    );
    region.addCharacter(store.characterMovement.draggedCharacter);
    onDragLeave();
  }
}

export const LabelComponent = observer(
  ({
    region,
    label,
    remove,
  }: {
    region: Region | Place;
    label: string;
    remove: () => void;
  }) => {
    const classes = useLabelStyles();
    const speedDialClasses = speedDialStyles();
    const [open, setOpen] = React.useState(false);

    const handleClose = (e: React.SyntheticEvent<{}>, type: string) => {
      if (type !== "toggle") {
        setOpen(false);
      } else {
        e.stopPropagation();
      }
    };

    const handleOpen = (e: React.SyntheticEvent<{}>, type: string) => {
      setOpen(true);
    };

    const actions = [
      {
        icon: <div>R</div>,
        name: "Add Region",
        onClick: (event: React.MouseEvent) => {
          event.stopPropagation();

          if (region instanceof Region) {
            region.createNewSubRegion();
          }
        },
      },
      {
        icon: <div>P</div>,
        name: "Add Place",
        onClick: (event: React.MouseEvent) => {
          event.stopPropagation();

          if (region instanceof Region) {
            region.createNewPlace();
          }
        },
      },
    ];

    return (
      <div
        className={classes.box}
        onDrop={(event) => onDrop(event, region)}
        onDragOver={(e) => allowDrop(e, region)}
        onDragLeave={onDragLeave}
      >
        <div className={classes.name}>{label}</div>
        <div className={classes.actions}>
          {region instanceof Region ? (
            <SpeedDial
              ariaLabel="SpeedDial example"
              className={classes.speedDial}
              classes={speedDialClasses}
              icon={<Add fontSize="small" />}
              onClose={handleClose}
              onOpen={handleOpen}
              open={open}
              direction="left"
            >
              {actions.map((action) => (
                <SpeedDialAction
                  className={classes.action}
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={action.onClick}
                />
              ))}
            </SpeedDial>
          ) : (
            ""
          )}
          <IconButton size="small" onClick={remove}>
            <Close />
          </IconButton>
        </div>
      </div>
    );
  }
);
