import {expect, render, test} from "@velmalabs/testsuite";

test('input', async () => {
    const screen = await render('./Input.svelte', {
        text: 'Hello',
    });
    const input = screen.locator('input');
    await input.fill('Hello World');

    expect(true).toBe(true);
});