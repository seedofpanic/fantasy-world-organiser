import { makeAutoObservable } from "mobx";
import { Character } from "./character";
import { Place } from "./place";

export class CharacterMovement {
  draggedCharacter?: Character;
  fromPlace?: Place;
  toPlace?: Place;
  order = 0;

  constructor() {
    makeAutoObservable(this);
  }

  startDragging(draggedCharacter: Character, fromPlace: Place) {
    this.draggedCharacter = draggedCharacter;
    this.fromPlace = fromPlace;
  }

  setToPlace(place: Place | undefined) {
    this.toPlace = place;
  }

  setOrder(number: number) {
    this.order = number;
  }
}
