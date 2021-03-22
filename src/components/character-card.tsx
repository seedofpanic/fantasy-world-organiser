import {Character} from "../store/character";
import {observer} from "mobx-react-lite";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme} from "@material-ui/core";
import {store} from "../store/store";
import CardContent from "@material-ui/core/CardContent";
import Close from '@material-ui/icons/Close';
import {useDrag} from "react-dnd";
import {DraggableItemTypes} from "../store/draggable-item-types";
import {Place} from "../store/place";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        character: {
            height: '100%',
            'box-sizing': 'border-box',
            display: 'flex',
            flexDirection: 'column'
        },
        title: {
            flex: '0 0 auto'
        },
        info: {
            flex: '1 1 auto',
            overflow: 'hidden'
        },
        infoBox: {
            overflow: 'hidden',
            height: '100%',
            position: 'relative',
            '&::after': {
                content: '""',
                textAlign: 'right',
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '30%',
                height: '1.4em',
                background: 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)'
            }
        }
    }),
);

const handleClickOpen = (event: React.MouseEvent<HTMLDivElement>, character: Character) => {
    store.setCharacterEditOpen(true, character);
};

const ClassRaceLabel = observer(({character}: {character: Character}) => {
    const texts = [];

    if (character.profession) {
        texts.push(character.profession);
    }

    if (character.race) {
        texts.push(character.race);
    }

    return <>
            {texts.join(' - ')}
        </>
});

const CharacterCard = observer(({place, character, remove}: {place: Place, character: Character, remove: () => void}) => {
    const classes = useStyles();
    const [{isDragging}, drag] = useDrag(() => ({
        type: DraggableItemTypes.Character,
        collect: monitor => ({
            isDragging: monitor.isDragging(),
            item: {
                character,
                place
            }
        }),
    }));



    function onRemoveClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.stopPropagation();
        remove();
    }

    return <Card ref={drag} className={classes.character} variant="outlined" onClick={(e) => handleClickOpen(e, character)}>
        <CardHeader className={classes.title}
            avatar={
                <Avatar aria-label="recipe">
                    {character.name[0] || 'NA'}
                </Avatar>
            }
            action={
                <IconButton aria-label="close" onClick={onRemoveClick}>
                    <Close/>
                </IconButton>
            }
            title={character.name || '<Unnamed character>'}
            subheader={<ClassRaceLabel character={character}/>}
        />
        <CardContent className={classes.info}>
            <div className={classes.infoBox}>
                {character.description}
            </div>
        </CardContent>
    </Card>;
});

export default CharacterCard;
