import {Place} from "../store/place";
import NameEdit from "./name-edit";
import React from "react";
import {observer} from "mobx-react-lite";
import CharactersGrid from "./characters-grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import {Character} from "../store/character";
import {store} from "../store/store";
import DeleteConfirmationDialog from "./delete-confirmation-dialog";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        box: {
            display: 'flex',
            'flex-direction': 'column',
            'flex-align': 'stretch',
            height: '100%'
        },
        name: {
            'margin-bottom': 30,
            padding: '10px 20px'
        },
        characters: {
            flex: '1 1 auto',
            overflow: 'auto',
            marginBottom: 30
        },
        actions: {
            flex: '0 0 auto',
            textAlign: 'right',
            padding: '10px 20px'
        },
        actionMargin: {
            marginRight: 10
        },
        paper: {
            width: '80%',
            maxHeight: 435,
        },
    }),
);

function removeCharacter(place: Place, character: Character) {
    store.setCharacterDeletion(true, place, character);
}

function handleClose(result: boolean) {
    if (result) {
        store.commitCharacterDeletion();
    }

    store.setCharacterDeletion(false);
}

function PlaceInfo({place}: { place: Place }) {
    const classes = useStyles();

    return <div className={classes.box}>
        <Card className={classes.name}>
            <NameEdit name={place.name} onChange={(name: string) => place.setName(name)}/>
        </Card>
        <div className={classes.characters}><CharactersGrid place={place} characters={place.characters} removeCharacter={(character) => removeCharacter(place, character)}/></div>
        <Card className={classes.actions}>
            <Button className={classes.actionMargin} variant="contained" color="primary" onClick={() => place.createNewCharacter()}>Add</Button>
            {/*<Button variant="contained" color="secondary" onClick={() => place.createNewCharacter()}>Generate</Button>*/}
        </Card>
        <DeleteConfirmationDialog
            classes={{
                paper: classes.paper,
            }}
            id="ringtone-menu"
            keepMounted
            onClose={handleClose}
            open={store.characterDeletion?.isOpen}
            toDeleteName={store.characterDeletion?.character?.name}/>
    </div>;
}

export default observer(PlaceInfo);
