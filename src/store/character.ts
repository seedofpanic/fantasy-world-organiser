import { makeAutoObservable } from "mobx";

let id = 0;

export class Character {
  static isSerializable = true;
  static type = "Character";

  id = id++;
  name: string = "";
  description: string = "";
  race: string = "";
  profession: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setName(name: string) {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setRace(race: string) {
    this.race = race;
  }

  setProfession(profession: string) {
    this.profession = profession;
  }

  setId(id: number) {}
}
