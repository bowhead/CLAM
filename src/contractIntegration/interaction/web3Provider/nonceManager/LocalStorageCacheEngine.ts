import ICacheEngine from "./ICacheEngine";

class LocalStorageCacheEngine implements ICacheEngine {

    get(key: string): string | number | undefined {
        const value = JSON.parse(localStorage.getItem(key) as string);
        return value;
    }
    set(key: string, value: string | number): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
    delete(key: string): void {
        localStorage.removeItem(key);
    }
    clear(): void {
        localStorage.clear();
    }

}

export default LocalStorageCacheEngine;