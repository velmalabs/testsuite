import {expect, render, test} from "@velmalabs/testsuite";
test('Input is rendering correctly with text prop', {tag: '@component'}, async () => {
    const screen = await render('./Input.svelte', {
        text: 'Hello',
    });
    const input = screen.locator('input');
    expect(input).toBeDefined();
    await input.fill('Hello World');
    expect(input).toHaveValue('Hello World');
});