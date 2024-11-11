import {expect, render, snippet, test} from "@velmalabs/testsuite";
test('List with children is rendered correctly', {tag: '@component'}, async () => {
    const screen = await render('./List.svelte', {
        children: snippet([
            {path: './ListItem.svelte', props: {text: 'First Child Element'}},
            {path: './ListItem.svelte', props: {text: 'Second Child Element'}},
        ]),
    });
    const list = screen.locator('section');
    expect(list).toBeDefined();

    expect(list.locator('div')).toHaveCount(2);
    expect(list.locator('> div').nth(0)).toContainText('First Child Element');
    expect(list.locator('> div').nth(1)).toContainText('Second Child Element');

});