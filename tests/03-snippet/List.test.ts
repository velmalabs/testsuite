import {expect, render, snippet, test} from "@velmalabs/testsuite";

test('input', async () => {
    await render('./List.svelte', {
        children: snippet([
            {path: './ListItem.svelte', props: { text: 'First Child Element' }},
            {path: './ListItem.svelte', props: { text: 'Second Child Element' }},
        ]),
    });
    expect(true).toBe(true);
});