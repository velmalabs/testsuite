import {render, test, expect} from "@velmalabs/testsuite";

test('Button rendered correctly and click event is working as expected', async () => {
    let clicked = false;
    const screen = await render('./Button.svelte', {
        text: 'Click Me',
        onclick: () => clicked = true
    });
    const button = screen.locator('button');
    expect(button).toBeDefined();
    expect(button).toContainText('Click Me');
    await button.click();
    expect(clicked).toBe(true);
});