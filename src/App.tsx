import React from 'react';
import './App.css';
import {makeStyles} from "@material-ui/core/styles";
import RegionsList from "./components/regions-list";
import {store} from "./store/store";
import {observer} from "mobx-react-lite";
import RegionInfo from "./components/region-info";
import {Region} from "./store/region";
import {Place} from "./store/place";
import PlaceInfo from "./components/place-info";

const useStyles = makeStyles({
  app: {
    display: 'flex',
    'flex-direction': 'row'
  },
  regionsList: {
    height: '100%',
    flex: '0 1 400px',
    padding: '30px',
    'box-sizing': 'border-box'
  },
  info: {
    flex: '1 1',
    padding: '30px',
    'background-color': '#f5f5f5'
  }
});

function App() {
  const classes = useStyles();

  function getInfoComponent(region: Region | Place) {
    if (region instanceof Region) {
      return <RegionInfo region={region}/>;
    }

    return <PlaceInfo place={region}></PlaceInfo>;
  }

  return (store.fileName ?
    <div className={'App ' + classes.app}>
      <div className={classes.regionsList}>
        <RegionsList/>
      </div>
      <div className={classes.info}>
        {store.selectedRegion
            ? getInfoComponent(store.selectedRegion)
            : ''}
      </div>
    </div> : <h1>No project loaded. Please create a new one with File/New</h1>
  );
}

export default observer(App);
