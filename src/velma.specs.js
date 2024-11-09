import {test} from '@playwright/test';

export let page;
export let testInfo;
test.beforeAll(async ({browser}, info) => {
    page = await browser.newPage();
    testInfo = info;
    await page.goto('http://localhost:4173/__testsuite__', {waitUntil: 'domcontentloaded'});
    await page.exposeFunction('sandboxFN', (evHash) => _ctx[evHash]());
    await page.waitForSelector('main', {state: 'attached'});
})

let _ctx = {};

async function render(component, props) {
    const path = locateComponent(component);
    const main = await page.getByTestId('main');
    await page.evaluate(async ({path, props}) => {
        if (!window.render) {
            await new Promise(resolve => {
                window.renderLoaded = () => resolve();
            });
        }
        window.render(path, {props});
    }, {path, props: serializeProps(props)});

    // Take a screenshot of the rendered component
    const homeScreenshot = await page.screenshot();
    await testInfo.attach('Screenshot', {
        body: homeScreenshot, contentType: 'image/png',
    });

    return main;
}


function serializeProps(props) {
    return Object.entries(props).reduce((acc, [key, value]) => {
        if (typeof value === 'function') {
            const evHash = value.toString().split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a
            }, 0).toString(36).substr(0, 8);
            _ctx[evHash] = value;
            acc[key] = `__FN__:()=>window.sandboxFN("${evHash}")`;
        } else if (typeof value === 'object') {
            acc[key] = serializeProps(value);
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});
}

function locateComponent(component) {
    const relativePath = backtraceFilePath(4).substring(1);
    const relativeDir = relativePath.split('/').slice(0, -1).join('/');
    return (relativeDir + '/' + component).replaceAll('/./', '/');
}

function backtraceFilePath(step = 2) {
    const rootPath = process.cwd();
    const stack = new Error().stack;
    const lines = stack.split('\n');
    const line = lines[step];
    return line.split(rootPath)[1].split(':')[0];
}


export {test, render};