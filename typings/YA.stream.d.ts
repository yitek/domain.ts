export declare type TPipeOperation = (input: any, next: any, args0: any, arg1: any, arg2: any) => void;
export declare class Stream {
    constructor(data: any);
    static extensions: {
        ctor: any;
        ops: any;
    }[];
}
export declare function stream(data: any, ops?: any): any;
