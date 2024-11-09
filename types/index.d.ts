import {Locator, Page} from 'playwright';

declare module '@velmalabs/testsuite' {
    export let page: Page;

    export function render(path: string, props: Record<string, unknown>): Promise<Locator>;

    export * from '@playwright/test';
}