declare const codeTrimRegx: RegExp;
declare function parseStatements(fn: Function): string[];
declare function parseAssertName(code: string): {
    name: string;
    code: string;
};
declare function parseStatement(code: string, start: number): number;
declare function testTest(assert: any): void;
declare const statements: string[];
declare class Section {
    title?: string;
    contents: string[];
    notices: string[];
    caption(value: string): this;
    content(value: string): this;
    notice(value: string): this;
}
declare class Namespace extends Section {
}
declare class Usage extends Section {
    fn: (...args: any[]) => any;
    constructor(fn: (...args: any[]) => any);
}
