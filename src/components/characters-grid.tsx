import React from "react";
import { observer } from "mobx-react-lite";
import { createStyles, Theme } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Character } from "../store/character";
import CharacterEditDialog from "./character-edit-dialog";
import CharacterCard from "./character-card";
import { Place } from "../store/place";
import { store } from "../store/store";

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

function CharactersGrid({
  characters,
  removeCharacter,
  place,
}: {
  characters: Set<Character>;
  removeCharacter: (character: Character) => void;
  place: Place;
}) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.gridList}>
        {Array.from(characters).map((character, index) => (
          <CharacterCard
            key={index}
            character={character}
            remove={() => removeCharacter(character)}
            onDragStart={(event) => onDragStart(event, character, place)}
          />
        ))}
      </div>
      <CharacterEditDialog />
    </>
  );
}

export default observer(CharactersGrid);
