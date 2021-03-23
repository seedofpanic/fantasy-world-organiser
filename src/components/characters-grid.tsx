import React, { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { createStyles, Theme } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Character } from "../store/character";
import CharacterEditDialog from "./character-edit-dialog";
import CharacterCard from "./character-card";
import { Place } from "../store/place";
import { store } from "../store/store";
import { Region } from "../store/region";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
    },
  })
);

function onDragStart(
  event: React.DragEvent,
  character: Character,
  place: Place
) {
  store.characterMovement.startDragging(character, place);
  // (event.target as HTMLDivElement).style.pointerEvents = 'none';
}

function removeCharacter(place: Place, character: Character) {
  store.setCharacterDeletion(true, place, character);
}

function CharactersGrid({ rootRegion }: { rootRegion: Region | Place }) {
  const classes = useStyles();

  function renderRegion(region: Region): ReactNode[] {
    return Array.from(region.children).map((region) =>
      region instanceof Place ? renderPlace(region) : renderRegion(region)
    );
  }

  function renderPlace(place: Place) {
    return Array.from(place.characters).map((character, index) => (
      <CharacterCard
        key={index}
        character={character}
        remove={() => removeCharacter(place, character)}
        onDragStart={(event) => onDragStart(event, character, place)}
      />
    ));
  }

  return (
    <>
      <div className={classes.gridList}>
        {rootRegion instanceof Region
          ? renderRegion(rootRegion)
          : renderPlace(rootRegion)}
      </div>
      <CharacterEditDialog />
    </>
  );
}

export default observer(CharactersGrid);
