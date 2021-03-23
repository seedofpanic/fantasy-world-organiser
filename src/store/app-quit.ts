import { makeAutoObservable } from "mobx";

export class AppQuit {
  canQuit = false;
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAppQuit(isOpen: boolean, canQuit = false) {
    this.isOpen = isOpen;
    this.canQuit = canQuit;
    window.close();
  }
}
