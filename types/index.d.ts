import {Locator, Page} from '@playwright/test';

declare module '@velmalabs/testsuite' {
    export let page: Page;

    export let dictionary: string[];

    export function render(path: string, props: Record<string, unknown>): Promise<Locator>;

    export function snippet(path: string, props: Record<string, unknown>): {
        type: 'snippet',
        components: SnippetConfig[]
    };
    export function snippet(snippets: Array<{ path: string; props: Record<string, unknown> }>): {
        type: 'snippet',
        components: SnippetConfig[]
    };
    export function snippet(raw: string): { type: 'raw', content: unknown; };

    export * from '@playwright/test';


    type SnippetConfig = {
        path: string;
        props: Record<string, unknown>;
    }[];
}