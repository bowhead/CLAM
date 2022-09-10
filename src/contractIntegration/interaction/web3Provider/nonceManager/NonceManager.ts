import 'reflect-metadata'
import ICacheEngine from "./ICacheEngine";
import { container } from "tsyringe";
import MemoryCacheEngine from "./MemoryCacheEngine";
import LocalStorageCacheEngine from "./LocalStorageCacheEngine";

container.register("cache", MemoryCacheEngine);
container.register("localStorage", LocalStorageCacheEngine);

class NonceManager {
    public cacheEngine: ICacheEngine;

    public constructor(cacheEngine: string, nonce: number) {
        this.cacheEngine = container.resolve(cacheEngine);
        this.cacheEngine.set('nonce', nonce);
    }

    public get(): number {
        return Number(this.cacheEngine.get('nonce'));
    }

    public save(nonce: number) {
        this.cacheEngine.set('nonce', nonce);
    }

}

export default NonceManager;