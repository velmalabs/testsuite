# Velma - Test Suite

---

This package contains the test suite of Velma. 

## What is Test Suite?

This package makes it easy to test svelte 5 components using playwright.

## Installation

Run the following command to install the package:

```bash
npm install @velmalabs/testsuite
```

## Usage

To use this package, you can run the following command:

```bash
  npm testsuite [playwright options]
```

## Examples


### Run tests in headless mode

```bash
  npm testsuite
```

### Run tests in ui mode

```bash
  npm testsuite --ui
```

### Run tests in headless mode with specific browser

```bash
  npm testsuite --browser=firefox
```

## Writing Tests

To write tests, you can create a file with the `.test.js` extension in your project.

```javascript
import {render, test, expect} from "@velmalabs/testsuite";

test('button', async () => {
    let clicked = false;
    const screen = await render('./Button.svelte', {
        text: 'Hello',
        onclick: () => clicked = true
    });
    const button = screen.locator('button');
    await button.click();
    expect(clicked).toBe(true);
});
```



## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Svelte Documentation](https://svelte.dev/docs)
