import { TreeItem, TreeItemProps } from "@material-ui/lab";
import React, { DragEvent } from "react";
import { Region } from "../store/region";
import { observer } from "mobx-react-lite";
import { createStyles, fade, Theme } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import { useSpring, animated } from "react-spring/web.cjs";
import Collapse from "@material-ui/core/Collapse";
import withStyles from "@material-ui/core/styles/withStyles";
import { store } from "../store/store";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Place } from "../store/place";
import { LabelComponent } from "./region-list-item-label";

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: { opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      "& .close": {
        opacity: 0.3,
      },
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
  })
)((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dragOver: {
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%);",
      color: "white",
    },
    actions: {
      textAlign: "center",
    },
  })
);

function remove(regionFrom: Region, region: Region | Place) {
  store.regionDeletion.setRegionDeletion(true, regionFrom, region);
}

const RegionListItem = observer(
  ({ region, path }: { region: Region; path: string }) => {
    const classes = useStyles();

    return (
      <>
        {Array.from(region.children).map((child, index) => {
          const nodeId = path ? path + "-" + index : index.toString();

          return (
            <StyledTreeItem
              className={
                child === store.characterMovement.toPlace
                  ? classes.dragOver
                  : ""
              }
              key={child.id}
              nodeId={nodeId}
              label={
                <LabelComponent
                  region={child}
                  remove={() => remove(region, child)}
                  label={child.name || "<Uncharted territory>"}
                />
              }
              onClick={() => store.selectRegion(child)}
            >
              {child instanceof Region && child.children.size ? (
                <RegionListItem region={child} path={path + "-" + index} />
              ) : (
                ""
              )}
            </StyledTreeItem>
          );
        })}
      </>
    );
  }
);

export default RegionListItem;
