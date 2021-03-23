import { Place } from "./place";
import { Character } from "./character";
import { makeAutoObservable } from "mobx";

export class CharacterDeletion {
  place?: Place;
  character?: Character;
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  setCharacterDeletion(isOpen: boolean, place?: Place, character?: Character) {
    this.place = place;
    this.character = character;
    this.isOpen = isOpen;
  }

  commitCharacterDeletion() {
    if (this.character) {
      this.place?.removeCharacter(this.character);
    }
  }
}
