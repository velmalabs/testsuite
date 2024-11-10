import {render, test, expect} from "@velmalabs/testsuite";

test('button', async () => {
    let clicked = false;
    const screen = await render('./Button.svelte', {
        text: 'Click Me',
        onclick: () => clicked = true
    });
    const button = screen.locator('button');
    await button.click();
    expect(clicked).toBe(true);
});