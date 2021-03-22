import { Place } from "./place";
import { makeAutoObservable } from "mobx";
import { store } from "./store";

let newId = 0;

export class Region {
  static isSerializable = true;
  static type = "Region";

  id = newId++;
  name = `Region ${this.id}`;
  children: Set<Region | Place> = new Set<Region | Place>();

  constructor() {
    makeAutoObservable(this);
  }

  addChild(child: Region | Place) {
    store.setSelectedRegion(child);
    this.children.add(child);
  }

  setId(id: number) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  setChildren(children: (Region | Place)[]) {
    this.children = new Set(children);
  }

  createNewSubRegion() {
    this.addChild(new Region());
  }

  createNewPlace() {
    this.addChild(new Place());
  }

  removeChild(region: Region | Place) {
    this.children.delete(region);
  }
}
