import React from "react";
import { Input } from "@material-ui/core";
import { observer } from "mobx-react-lite";

function NameEdit({
  name,
  onChange,
}: {
  name: string;
  onChange: (name: string) => void;
}) {
  return <Input value={name} onChange={(e) => onChange(e.target.value)} />;
}

export default observer(NameEdit);
