import {makeAutoObservable, reaction} from "mobx";
import {Region} from "./region";
import {Place} from "./place";
import {Character} from "./character";
import {CharacterMovement} from "./characterMovement";

const serializers = {
    [Region.type]: Region,
    [Place.type]: Place,
    [Character.type]: Character
};

declare var window: Window & typeof globalThis & {
    saveData: (data: string, cb?: () => void) => void;
    loadData: (cb: (data: {data: string, fileName: string}) => void) => void;
    initSavingProcess: () => void;
};

class Store {
    fileName = '';
    rootRegion?: Region;
    selectedRegion: Region | Place | null = null;
    characterEdit: {
        character?: Character,
        isOpen: boolean,
        formData: Partial<Character>;
    } = {
        isOpen: false,
        formData: {}
    };
    regionDeletion: {
        regionFrom?: Region;
        region?: Region | Place;
        isOpen: boolean
    } = {
        isOpen: false
    };
    characterDeletion: {
        place?: Place;
        character?: Character;
        isOpen: boolean
    } = {
        isOpen: false
    };
    appQuite: {
        canQuite: boolean;
        isOpen: boolean
    } = {
        canQuite: false,
        isOpen: false
    };
    characterMovement = new CharacterMovement();

    constructor() {
        makeAutoObservable(this);
    }

    setAppQuite(isOpen: boolean, canQuite = false) {
        this.appQuite.isOpen = isOpen;
        this.appQuite.canQuite = canQuite;
        window.close();
    }

    setRegionDeletion(isOpen: boolean, regionFrom?: Region, region?: Region | Place) {
        this.regionDeletion.regionFrom = regionFrom;
        this.regionDeletion.region = region;
        this.regionDeletion.isOpen = isOpen;
    }

    commitRegionDeletion() {
        if (this.regionDeletion.region) {
            this.regionDeletion.regionFrom?.removeChild(this.regionDeletion.region);
        }
    };

    setCharacterDeletion(isOpen: boolean, place?: Place, character?: Character) {
        this.characterDeletion.place = place;
        this.characterDeletion.character = character;
        this.characterDeletion.isOpen = isOpen;
    }

    commitCharacterDeletion() {
        if (this.characterDeletion.character) {
            this.characterDeletion.place?.removeCharacter(this.characterDeletion.character);
        }
    };

    clearRegion() {
        this.rootRegion = new Region();
    }

    selectRegion(region: Region | Place) {
        this.selectedRegion = region;
    }

    restore(store: Partial<Store>) {
        if (store.rootRegion) {
            this.rootRegion = store.rootRegion;
        }
    }

    setFileName(fileName: string) {
        this.fileName = fileName;
    }

    setSelectedRegion(region: Region | Place) {
        this.selectedRegion = region;
    }

    setCharacterEditOpen(isOpen: boolean, character?: Character) {
        if (character) {
            this.characterEdit.character = character;
            this.characterEdit.formData = {...character};
        }

        this.characterEdit.isOpen = isOpen;
    }

    updateCharacterFromForm() {
        Object.keys(this.characterEdit.formData).forEach(key => {
            // @ts-ignore
            this.characterEdit.character[`set${key[0].toUpperCase()}${key.substr(1)}`](this.characterEdit.formData[key] || '');
        });
    }

    updateCharacterEditForm(key: keyof Character, value: any) {
        this.characterEdit.formData[key] = value;
    }
}

export const store = new Store();

reaction(() => store.fileName, fileName => {
    document.title = `Fantasy World Organizer (${fileName})`;
});

window.loadData((data) => {
    loadData(data);

    if (data.fileName) {
        startSaving();
    }
});

let savingTimer: any;

function startSaving() {
    if (savingTimer) {
        clearTimeout(savingTimer);
    }

    savingTimer = setTimeout(() => {
        saveCurrentProject();
    }, 10000);
}

document.addEventListener('keydown', (event) => {
   if (event.code === 'KeyS' && event.ctrlKey && !event.altKey && !event.shiftKey) {
       saveCurrentProject();
   }
});

export const saveCurrentProject = (cb?: () => void) => {
    const data = JSON.stringify(store, (key, value) => {
        if (value && typeof value === "object" && value.constructor.isSerializable) {
            return {...value, type: value.constructor.type};
        }

        return value;
    });

    window.saveData(data, cb);
};

function loadData({data, fileName}: {data: string, fileName: string}) {
    store.clearRegion();
    store.setFileName(fileName);

    if (!data) {
        return;
    }

    const restored = JSON.parse(data, (key, value) => {
        if (value && typeof value === 'object' && value.type) {
            // @ts-ignore
            return restore(new serializers[value.type](), value);
        }

        return value;
    });
    store.restore(restored);
}

function restore<T>(obj: T, data: Partial<T>) {
    Object.keys(obj).forEach((key) => {
        if (data[key as keyof T]) {
            try {
                // @ts-ignore
                obj[`set${key[0].toUpperCase()}${key.substr(1)}`](data[key]);
            } catch (e) {
                // @ts-ignore
                throw new Error(`No set${key[0].toUpperCase()}${key.substr(1)} in ${obj.constructor.type}`);
            }
        }
    });

    return obj;
}

window.onbeforeunload = (e: BeforeUnloadEvent) => {
    if (!store.appQuite.canQuite) {
        store.setAppQuite(true);
    }

    if (store.appQuite.canQuite) {
        return;
    } else {
        return store.appQuite.canQuite;
    }
};
