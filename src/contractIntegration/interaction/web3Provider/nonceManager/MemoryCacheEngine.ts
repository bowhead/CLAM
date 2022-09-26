import ICacheEngine from './ICacheEngine';
//eslint-disable-next-line
import { injectable } from 'tsyringe';

/**
 * This class is used to manage the data in memory
 */
@injectable()
class MemoryCacheEngine implements ICacheEngine {
    public data: Map<string, string | number>;
    /**
     * This constructor starts the memoryCache
     */
    public constructor() {
        this.data = new Map<string, string | number>();
    }

    /**
     * This function returns the value in memory whose key is equal 
     * to the key passed as a function parameter.
     * 
     * @param {string} key the key in the map 
     * @returns {string |number | undefined} the value of the key
     */
    get(key: string): string | number | undefined {
        if (key.trim().length === 0 || key.trim() === '') throw new Error('Error: Invalid key');
        const value: string | number | undefined = this.data.get(key);
        return value;
    }

    /**
     * This function adds or update a new value with reference 
     * to the key passed as parameter.
     * 
     * @param {string} key the identifier  
     * @param {string} value the value 
     */
    set(key: string, value: string | number): void {
        if (key.trim().length === 0 || key.trim() === '') throw new Error('Error: Invalid key');
        if (typeof value === 'string' && (value.trim().length === 0 || value.trim() === '')) throw new Error('Error: Empty value');
        this.data.set(key.trim(), typeof value === 'string' ? value.trim() : value);
    }

    /**
     * This function deletes the value where the key is equal to the key passed in parameter
     * @param {string} key The key to be used to delete the value. 
     */
    delete(key: string): void {
        if (key.trim().length === 0 || key.trim() === '') throw new Error('Error: Invalid key');
        this.data.delete(key.trim());
    }

    /**
     * This function clear the memory cache.
     */
    clear(): void {
        this.data.clear();
    }

}

export default MemoryCacheEngine;