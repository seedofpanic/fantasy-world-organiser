import { makeAutoObservable } from "mobx";
import { Character } from "./character";

let newId = 1;

export class Place {
  static isSerializable = true;
  static type = "Place";

  id = newId++;
  name = `Place ${this.id}`;
  characters: Set<Character> = new Set<Character>();

  constructor() {
    makeAutoObservable(this);
  }

  addCharacter(character: Character) {
    this.characters.add(character);
  }

  setId(id: number) {
    this.id = id;
  }

  setName(name: string) {
    this.name = name;
  }

  setCharacters(characters: Set<Character>) {
    this.characters = new Set(characters);
  }

  createNewCharacter() {
    this.addCharacter(new Character());
  }

  removeCharacter(character: Character) {
    this.characters.delete(character);
  }
}
