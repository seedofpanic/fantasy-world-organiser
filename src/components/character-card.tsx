import { Character } from "../store/character";
import { observer } from "mobx-react-lite";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { createStyles, Theme } from "@material-ui/core";
import { store } from "../store/store";
import CardContent from "@material-ui/core/CardContent";
import Close from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    character: {
      "box-sizing": "border-box",
      display: "flex",
      flexDirection: "column",
    },
    title: {
      flex: "0 0 auto",
    },
    info: {
      flex: "1 1 auto",
      overflow: "hidden",
    },
    infoBox: {
      overflow: "hidden",
      height: "100%",
      position: "relative",
      fontStyle: "italic",
      "&::after": {
        content: '""',
        textAlign: "right",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "30%",
        height: "1.4em",
        background:
          "linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)",
      },
    },
    still: {
      height: "100%",
    },
    isDragging: {
      height: "72px !important",
    },
  })
);

const handleClickOpen = (
  event: React.MouseEvent<HTMLDivElement>,
  character: Character
) => {
  store.characterEdit.setCharacterEditOpen(true, character);
};

const ClassRaceLabel = observer(({ character }: { character: Character }) => {
  const texts = [];

  if (character.profession) {
    texts.push(character.profession);
  }

  if (character.race) {
    texts.push(character.race);
  }

  return <>{texts.join(" - ")}</>;
});

const CharacterCard = observer(
  ({
    onDragStart,
    character,
    remove,
  }: {
    onDragStart: (event: React.DragEvent) => void;
    character: Character;
    remove: () => void;
  }) => {
    const classes = useStyles();

    function onRemoveClick(event: React.MouseEvent<HTMLButtonElement>) {
      event.stopPropagation();
      remove();
    }

    return (
      <Card
        draggable="true"
        onDragStart={onDragStart}
        className={`${classes.character} ${classes.still}`}
        variant="outlined"
        onClick={(e) => handleClickOpen(e, character)}
      >
        <CardHeader
          className={classes.title}
          avatar={
            <Avatar aria-label="recipe">{character.name[0] || "NA"}</Avatar>
          }
          action={
            <IconButton aria-label="close" onClick={onRemoveClick}>
              <Close />
            </IconButton>
          }
          title={character.name || "<Unnamed character>"}
          subheader={<ClassRaceLabel character={character} />}
        />
        <CardContent className={classes.info}>
          <div className={classes.infoBox}>{character.description}</div>
        </CardContent>
      </Card>
    );
  }
);

export default CharacterCard;
