import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { createStyles, Theme } from "@material-ui/core";

export interface ConfirmationDialogRawProps {
  classes: Record<"paper", string>;
  id: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (result: boolean) => void;
  toDeleteName?: string;
  title?: string;
}

const useLabelStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      whiteSpace: "nowrap",
    },
  })
);

function DeleteConfirmationDialog(props: ConfirmationDialogRawProps) {
  const { onClose, open, toDeleteName, title, ...other } = props;
  const radioGroupRef = React.useRef<HTMLElement>(null);
  const classes = useLabelStyles();

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title" className={classes.title}>
        {title ? (
          <span>{title}</span>
        ) : (
          <span>
            Are you sure you want to delete{" "}
            {toDeleteName ? `"${toDeleteName}"` : "this item"}?
          </span>
        )}
      </DialogTitle>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          No
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
