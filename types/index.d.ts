import {Locator, Page} from 'playwright';

declare module '@velmalabs/testsuite' {
    export function render(path: string, props: Record<string, unknown>): Promise<Locator>;

    export function test(description: string, test: () => Promise<void>): void;

    export let page: Page;
}