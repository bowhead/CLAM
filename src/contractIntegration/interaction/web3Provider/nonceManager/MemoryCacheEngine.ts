import ICacheEngine from "./ICacheEngine";
import { injectable } from "tsyringe";

@injectable()
class MemoryCacheEngine implements ICacheEngine {
    public data: Map<string, string | number>;
    public constructor() {
        this.data = new Map<string, string | number>();
    }

    get(key: string): string | number | undefined {
        if (key.trim().length === 0 || key.trim() === '') throw new Error("Error: Invalid key");
        const value: string | number | undefined = this.data.get(key);
        return value;
    }

    set(key: string, value: string | number): void {
        if (key.trim().length === 0 || key.trim() === '') throw new Error("Error: Invalid key");
        if (typeof value === 'string' && (value.trim().length === 0 || value.trim() === '')) throw new Error("Error: Empty value");
        this.data.set(key.trim(), typeof value === 'string' ? value.trim() : value);
    }

    delete(key: string): void {
        if (key.trim().length === 0 || key.trim() === '') throw new Error("Error: Invalid key");
        this.data.delete(key.trim());
    }

    clear(): void {
        this.data.clear();
    }

}

export default MemoryCacheEngine;