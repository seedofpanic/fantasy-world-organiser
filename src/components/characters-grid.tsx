import React from "react";
import {observer} from "mobx-react-lite";
import {createStyles, GridList, Theme} from "@material-ui/core";
import GridListTile from "@material-ui/core/GridListTile";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Character} from "../store/character";
import CharacterEditDialog from "./character-edit-dialog";
import CharacterCard from "./character-card";
import {Place} from "../store/place";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: '100%'
        }
    }),
);

function CharactersGrid({characters, removeCharacter, place}: { characters: Set<Character>, removeCharacter: (character: Character) => void, place: Place }) {
    const classes = useStyles();

    return <>
        <GridList cellHeight={160} className={classes.gridList} cols={3}>
            {Array.from(characters).map((character, index) => (
                <GridListTile key={index} cols={1}>
                    <CharacterCard place={place} character={character}
                                   remove={() => removeCharacter(character)}/>
                </GridListTile>
            ))}
        </GridList>
        <CharacterEditDialog/>
    </>;
}

export default observer(CharactersGrid);
