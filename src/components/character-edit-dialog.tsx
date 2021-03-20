import React from "react";
import {observer} from "mobx-react-lite";
import {store} from "../store/store";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {Character} from "../store/character";
import {Autocomplete} from "@material-ui/lab";
import {professions} from "../store/professions";
import {races} from "../store/races";
import {makeStyles} from "@material-ui/core/styles";

const handleChange = (value: string | null, field: keyof Character) => {
    console.log(value);
    store.updateCharacterEditForm(field, value);
};

const handleClose = () => {
    store.setCharacterEditOpen(false);
};

const handleSave = () => {
    store.updateCharacterFromForm();
    handleClose();
};

const useStyles = makeStyles({
    dialog: {
        minWidth: '500px'
    },
});

function CharacterEditDialog() {
    const classes = useStyles();

    return <Dialog open={store.characterEdit.isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle>Character info</DialogTitle>
        <DialogContent>
            <div className={classes.dialog}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Character name"
                    type="text"
                    fullWidth
                    onChange={(e) => handleChange(e.target.value, 'name')}
                    value={store.characterEdit.formData?.name}
                />
                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    options={professions.map((option) => option)}
                    onInputChange={(e, value) =>
                        handleChange(value, 'profession')}
                    value={store.characterEdit.formData?.profession}
                    renderInput={(params) => (
                        <TextField {...params} label="Professions" margin="normal" variant="outlined"/>
                    )}
                />
                <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    options={races.map((option) => option)}
                    onInputChange={(e, value) =>
                        handleChange(value, 'race')}
                    value={store.characterEdit.formData?.race}
                    renderInput={(params) => (
                        <TextField {...params} label="Races" margin="normal" variant="outlined"/>
                    )}
                />
                <TextField
                    id="standard-multiline-flexible"
                    label="Notes"
                    multiline
                    fullWidth
                    rowsMax={4}
                    value={store.characterEdit.formData?.description}
                    onChange={(e) => handleChange(e.target.value, 'description')}
                />
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
                Save
            </Button>
        </DialogActions>
    </Dialog>
}

export default observer(CharacterEditDialog);
