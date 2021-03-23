import { makeAutoObservable } from "mobx";

export class AppQuite {
  canQuite = false;
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAppQuite(isOpen: boolean, canQuite = false) {
    this.isOpen = isOpen;
    this.canQuite = canQuite;
    window.close();
  }
}
