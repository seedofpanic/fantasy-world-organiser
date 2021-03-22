import {TreeItem, TreeItemProps} from "@material-ui/lab";
import React from "react";
import {Region} from "../store/region";
import {observer} from "mobx-react-lite";
import {createStyles, fade, Theme} from "@material-ui/core";
import {TransitionProps} from "@material-ui/core/transitions";
import {useSpring, animated} from 'react-spring/web.cjs';
import Collapse from "@material-ui/core/Collapse";
import withStyles from "@material-ui/core/styles/withStyles";
import {store} from "../store/store";
import makeStyles from "@material-ui/core/styles/makeStyles"; // web.cjs is required for IE 11 support
import IconButton from '@material-ui/core/IconButton';
import {Add, Close} from "@material-ui/icons";
import {Place} from "../store/place";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import {useDrop} from "react-dnd";
import {DraggableItemTypes} from "../store/draggable-item-types";
import {Character} from "../store/character";

function TransitionComponent(props: TransitionProps) {
    const style = useSpring({
        from: {opacity: 0, transform: 'translate3d(20px,0,0)'},
        to: {opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)`},
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

const useLabelStyles = makeStyles((theme: Theme) =>
    createStyles({
        box: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        name: {
            flex: '1 1 auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        actions: {
            position: 'relative',
            display: 'flex',
            flex: '0 0 auto',
            flexDirection: 'row',
            marginLeft: 20
        },
        speedDial: {
            right: '100%',
            top: -16,
            position: 'absolute'
        },
        action: {
            backgroundColor: 'red',
            color: 'white'
        }
    }),
);

const speedDialStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            width: 20,
            height: 20,
            minHeight: 20,
            marginTop: 5,
            alignItems: 'flex-start'
        }
    }),
);

function LabelComponent({region, label, remove}: { region: Region | Place, label: React.ReactNode, remove: () => void }) {
    const classes = useLabelStyles();
    const speedDialClasses = speedDialStyles();
    const [open, setOpen] = React.useState(false);
    let [, drop] = useDrop<Character, void, void>(
        () => ({
            accept: DraggableItemTypes.Character,
            drop: (character: Character) => {
                console.log(character);
                if (region instanceof Place) {
                    region.addCharacter(character);
                }
            }
        })
    );

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const actions = [
        {
            icon: <div>R</div>, name: 'Add Region', onClick: () => {
                if (region instanceof Region) {
                    region.createNewSubRegion();
                }
                handleClose();
            }
        },
        {
            icon: <div>P</div>, name: 'Add Place', onClick: () => {
                if (region instanceof Region) {
                    region.createNewPlace();
                }
                handleClose();
            }
        },
    ];

    return <div className={classes.box} ref={drop}>
        <div className={classes.name}>{label}</div>
        <div className={classes.actions}>
            {region instanceof Region ?
                <SpeedDial
                    ariaLabel="SpeedDial example"
                    className={classes.speedDial}
                    classes={speedDialClasses}
                    icon={<Add fontSize="small"/>}
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
                        />))}
                </SpeedDial>
                : ''}
            <IconButton size="small" onClick={remove}><Close/></IconButton>
        </div>
    </div>;
}

const StyledTreeItem = withStyles((theme: Theme) =>
    createStyles({
        iconContainer: {
            '& .close': {
                opacity: 0.3,
            },
        },
        group: {
            marginLeft: 7,
            paddingLeft: 18,
            borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
        },
    }),
)((props: TreeItemProps) => <TreeItem {...props} TransitionComponent={TransitionComponent}/>);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        actions: {
            textAlign: 'center'
        }
    }),
);

function remove(regionFrom: Region, region: Region | Place) {
    store.setRegionDeletion(true, regionFrom, region);
}

const RegionListItem = observer(({region, path}: { region: Region, path: string }) => {
    const classes = useStyles();

    return <>
        {Array.from(region.children).map((child, index) =>
            <StyledTreeItem key={child.id} nodeId={path + '-' + index}
                            label={<LabelComponent region={child}
                                                   remove={() => remove(region, child)}
                                                   label={child.name || '<Uncharted territory>'}/>}
                            onClick={() => store.selectRegion(child)}>
                {(child instanceof Region) && child.children.size ?
                    <RegionListItem region={child} path={path + '-' + index}/> :
                    ''
                }
            </StyledTreeItem>
        )}
    </>
});

export default RegionListItem;
