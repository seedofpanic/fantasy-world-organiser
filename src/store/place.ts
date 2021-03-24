import { makeAutoObservable } from "mobx";
import { Character } from "./character";

let newId = 1;

export class Place {
  static isSerializable = true;
  static type = "Place";

  id = newId++;
  name = `Place ${this.id}`;
  characters: Character[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addCharacter(character: Character) {
    this.characters.push(character);
  }

  setId(id: number) {}

  setName(name: string) {
    this.name = name;
  }

  setCharacters(characters: Character[]) {
    this.characters = characters;
  }

  createNewCharacter() {
    this.addCharacter(new Character());
  }

  removeCharacter(character: Character) {
    this.characters.splice(this.characters.indexOf(character), 1);
  }

  reorderCharacter(draggedCharacter: Character, order: number) {
    this.removeCharacter(draggedCharacter);
    this.characters.splice(order, 0, draggedCharacter);
  }
}
