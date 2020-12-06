export declare class Logger {
    section(name: any, statement: any): this;
    code(...args: any[]): this;
    success(...args: any[]): this;
    error(...args: any[]): this;
    static default: Logger;
}
export declare type TExecutable = {
    execute(logger: Logger, self?: any): any;
};
export declare class TestMethod implements TExecutable {
    method: (ASSERT: (asserts: {
        [msg: string]: () => boolean;
    }) => any) => any;
    name?: string;
    statements: TExecutable[];
    constructor(method: (ASSERT: (asserts: {
        [msg: string]: () => boolean;
    }) => any) => any, name?: string);
    execute(logger: Logger, self?: any): any;
    static fetch(method: (ASSERT: (asserts: {
        [msg: string]: () => boolean;
    }) => any) => any, name?: string): TestMethod;
}
export declare function testable(desp: any, test?: any): number | ((target: any, name?: any) => number);
