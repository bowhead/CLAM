interface ICacheEngine {
    get(key: string): string | number | undefined;
    set(key: string, value: string | number): void;
    delete(key: string): void;
    clear(): void;
}
export default ICacheEngine;
