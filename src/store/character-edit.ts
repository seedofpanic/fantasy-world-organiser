import { makeAutoObservable } from "mobx";
import { Character } from "./character";

export class CharacterEdit {
  character?: Character;
  isOpen = false;
  formData: Partial<Character> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setCharacterEditOpen(isOpen: boolean, character?: Character) {
    if (character) {
      this.character = character;
      this.formData = { ...character };
    }

    this.isOpen = isOpen;
  }

  updateCharacterFromForm() {
    Object.keys(this.formData).forEach((key) => {
      if (!this.character) {
        return;
      }

      (this.character[
        `set${key[0].toUpperCase()}${key.substr(1)}` as keyof Character
      ] as (value: string) => void)(
        (this.formData[key as keyof Character] as string) || ""
      );
    });
  }

  updateCharacterEditForm(key: keyof Character, value: any) {
    this.formData[key] = value;
  }
}
