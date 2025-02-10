declare class MyWorker {
    queue: any[];
    worker: Worker;
    constructor(url: any);
    post(params: any, onError?: () => any): Promise<MessageEvent>;
    destroy(): void;
}
export declare function createWorker(f: any): MyWorker;
export {};
