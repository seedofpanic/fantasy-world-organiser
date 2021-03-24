import React, { DragEvent, ReactNode } from "react";
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
    characterBox: {
      flex: "0 1 33%",
      boxSizing: "border-box",
      height: 177,
      padding: 10,
    },
  })
);

let draggedRef: React.RefObject<HTMLDivElement>;

function onDragStart(
  event: React.DragEvent,
  character: Character,
  place: Place,
  characterBoxRef: React.RefObject<HTMLDivElement>
) {
  store.characterMovement.startDragging(character, place);
  draggedRef = characterBoxRef;
}

function removeCharacter(place: Place, character: Character) {
  store.characterDeletion.setCharacterDeletion(true, place, character);
}

function onDrop() {
  if (
    draggedRef.current &&
    store.characterMovement.fromPlace &&
    store.characterMovement.draggedCharacter
  ) {
    store.characterMovement.fromPlace.reorderCharacter(
      store.characterMovement.draggedCharacter,
      store.characterMovement.order
    );
  }
}

function allowDrop(
  ev: React.DragEvent,
  characterBoxRef: React.RefObject<HTMLDivElement>
) {
  ev.preventDefault();

  if (characterBoxRef.current && draggedRef.current) {
    // Ignore dragging on it self
    if (+characterBoxRef.current.style.order % 2) {
      return;
    }

    if (characterBoxRef !== draggedRef) {
      // If the card was dragged from right than we need to place it to the left of a target and vice versa
      const correction =
        +draggedRef.current.style.order > +characterBoxRef.current.style.order
          ? -1
          : 1;
      // Calculating array insert index
      const order =
        +characterBoxRef.current.style.order / 2 + (correction === 1 ? 1 : 0);

      draggedRef.current.style.order = (
        +characterBoxRef.current.style.order + correction
      ).toString();

      store.characterMovement.setOrder(order);
    }
  }
}

function CharactersGrid({ rootRegion }: { rootRegion: Region | Place }) {
  const classes = useStyles();

  function renderRegion(region: Region): ReactNode[] {
    return Array.from(region.children).map((region) =>
      region instanceof Place ? renderPlace(region) : renderRegion(region)
    );
  }

  function renderPlace(place: Place) {
    return (
      <div key={place.id}>
        <h3>{place.name}</h3>
        <div className={classes.gridList}>
          {Array.from(place.characters).map((character, index) => {
            const characterBoxRef = React.createRef<HTMLDivElement>();

            return (
              <div
                key={character.id}
                ref={characterBoxRef}
                className={classes.characterBox}
                style={{ order: index * 2 }}
                onDrop={onDrop}
                onDragOver={(e) => allowDrop(e, characterBoxRef)}
              >
                <CharacterCard
                  key={index}
                  character={character}
                  remove={() => removeCharacter(place, character)}
                  onDragStart={(event) =>
                    onDragStart(event, character, place, characterBoxRef)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <>
      {rootRegion instanceof Region
        ? renderRegion(rootRegion)
        : renderPlace(rootRegion)}
      <CharacterEditDialog />
    </>
  );
}

export default observer(CharactersGrid);
