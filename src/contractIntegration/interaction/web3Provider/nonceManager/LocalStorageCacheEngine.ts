import ICacheEngine from './ICacheEngine';
/**
 * This class is used to manage the data in localstorage
 */
class LocalStorageCacheEngine implements ICacheEngine {
    /**
     * This function returns the value in memory whose key is equal 
     * to the key passed as a function parameter.
     * 
     * @param {string} key the key in the map 
     * @returns {string |number | undefined} the value of the key
     */
    get(key: string): string | number | undefined {
        const value = JSON.parse(localStorage.getItem(key) as string);
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
        localStorage.setItem(key, JSON.stringify(value));
    }
    /**
     * This function deletes the value where the key is equal to the key passed in parameter
     * @param {string} key The key to be used to delete the value. 
     */
    delete(key: string): void {
        localStorage.removeItem(key);
    }
    /**
     * This function clear localStorage
     */
    clear(): void {
        localStorage.clear();
    }

}

export default LocalStorageCacheEngine;