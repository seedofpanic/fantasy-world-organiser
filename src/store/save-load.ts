import { reaction } from "mobx";
import { store } from "./store";
import { Region } from "./region";
import { Place } from "./place";
import { Character } from "./character";

const serializers = {
  [Region.type]: Region,
  [Place.type]: Place,
  [Character.type]: Character,
};

declare var window: Window &
  typeof globalThis & {
    saveData: (data: string, cb?: () => void) => void;
    loadData: (cb: (data: { data: string; fileName: string }) => void) => void;
    initSavingProcess: () => void;
  };

reaction(
  () => store.fileName,
  (fileName) => {
    document.title = `Fantasy World Organiser (${fileName})`;
  }
);

window.loadData((data) => {
  if (savingTimer) {
    clearTimeout(savingTimer);
    savingTimer = null;
  }

  try {
    loadData(data);
  } catch (e) {
    console.log("failed to load file " + data.fileName);

    return;
  }

  if (data.fileName) {
    startSaving();
  }
});

let savingTimer: any;

function startSaving() {
  savingTimer = setTimeout(() => {
    saveCurrentProject();
  }, 10000);
}

document.addEventListener("keydown", (event) => {
  if (
    event.code === "KeyS" &&
    event.ctrlKey &&
    !event.altKey &&
    !event.shiftKey
  ) {
    saveCurrentProject();
  }
});

export const saveCurrentProject = (cb?: () => void) => {
  const dataToSave = { rootRegion: store.rootRegion };
  const data = JSON.stringify(dataToSave, (key, value) => {
    if (
      value &&
      typeof value === "object" &&
      value.constructor.isSerializable
    ) {
      return { ...value, type: value.constructor.type };
    }

    return value;
  });

  window.saveData(data, cb);
};

function loadData({ data, fileName }: { data: string; fileName: string }) {
  store.clearRegion();
  store.setFileName(fileName);

  if (!data) {
    return;
  }

  const restored = JSON.parse(data, (key, value) => {
    if (value && typeof value === "object" && value.type) {
      return restore(new (serializers[value.type] as any)(), value);
    }

    return value;
  });
  store.restore(restored);
}

function restore<T>(
  obj: T & { constructor: { type: string } },
  data: Partial<T>
) {
  Object.keys(obj).forEach((key) => {
    if (data[key as keyof T]) {
      const setMethodKey = `set${key[0].toUpperCase()}${key.substr(
        1
      )}` as keyof T;

      try {
        (obj[setMethodKey] as any)(data[key as keyof T] as any);
      } catch (e) {
        throw new Error(`No ${setMethodKey} in ${obj.constructor.type}`);
      }
    }
  });

  return obj;
}
