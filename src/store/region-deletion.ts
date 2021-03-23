import { makeAutoObservable } from "mobx";
import { Region } from "./region";
import { Place } from "./place";

export class RegionDeletion {
  regionFrom?: Region;
  region?: Region | Place;
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  setRegionDeletion(
    isOpen: boolean,
    regionFrom?: Region,
    region?: Region | Place
  ) {
    this.regionFrom = regionFrom;
    this.region = region;
    this.isOpen = isOpen;
  }

  commitRegionDeletion() {
    if (this.region) {
      this.regionFrom?.removeChild(this.region);
    }
  }
}
