import React from "react";
import { Region } from "../store/region";
import NameEdit from "./name-edit";
import { observer } from "mobx-react-lite";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      display: "flex",
      "flex-direction": "column",
      "flex-align": "stretch",
      height: "100%",
    },
    name: {
      "margin-bottom": 30,
      textAlign: "center",
    },
    characters: {
      flex: "1 1 auto",
      overflow: "auto",
    },
    actions: {
      flex: "0 0 auto",
    },
  })
);

function RegionInfo({ region }: { region: Region }) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.name}>
        <NameEdit
          name={region.name}
          onChange={(name: string) => region.setName(name)}
        />
      </div>
    </div>
  );
}

export default observer(RegionInfo);
