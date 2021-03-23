import { makeAutoObservable } from "mobx";
import { Region } from "./region";
import { Place } from "./place";
import { CharacterMovement } from "./character-movement";
import { CharacterDeletion } from "./character-deletion";
import { AppQuite } from "./app-quite";
import { RegionDeletion } from "./region-deletion";
import { CharacterEdit } from "./character-edit";

class Store {
  fileName = "";
  rootRegion?: Region;
  selectedRegion: Region | Place | null = null;
  characterEdit = new CharacterEdit();
  regionDeletion = new RegionDeletion();
  characterDeletion = new CharacterDeletion();
  appQuite = new AppQuite();
  characterMovement = new CharacterMovement();

  constructor() {
    makeAutoObservable(this);
  }

  clearRegion() {
    this.rootRegion = new Region();
  }

  selectRegion(region: Region | Place) {
    this.selectedRegion = region;
  }

  restore(store: Partial<Store>) {
    if (store.rootRegion) {
      this.rootRegion = store.rootRegion;
    }
  }

  setFileName(fileName: string) {
    this.fileName = fileName;
  }

  setSelectedRegion(region: Region | Place) {
    this.selectedRegion = region;
  }
}

export const store = new Store();

window.onbeforeunload = (e: BeforeUnloadEvent) => {
  if (!store.appQuite.canQuite) {
    store.appQuite.setAppQuite(true);
  }

  if (store.appQuite.canQuite) {
    return;
  } else {
    return store.appQuite.canQuite;
  }
};
