import {test} from '@playwright/test';

export * from '@playwright/test';
import dictionary from '../.cache/dictionary.js';

export let page;
export let testInfo;
test.beforeAll(async ({browser}, info) => {
    page = await browser.newPage();
    testInfo = info;
    await page.goto('http://localhost:4173/__testsuite__', {waitUntil: 'domcontentloaded'});
    await page.exposeFunction('sandboxFN', (evHash) => _ctx[evHash]());
    await page.waitForSelector('main', {state: 'attached'});
});

test.afterEach(async () => {
    // Take a screenshot of the rendered component
    const homeScreenshot = await page.screenshot();
    await testInfo.attach('Screenshot', {
        body: homeScreenshot, contentType: 'image/png',
    });
});

let _ctx = {};

async function render(component, props) {
    const path = locateComponent(component, 'render');
    const main = await page.getByTestId('main');
    await page.evaluate(async ({path, props}) => {
        if (!window.render) {
            await new Promise(resolve => {
                window.renderLoaded = () => resolve();
            });
        }
        window.render(path, {props});
    }, {path, props: serializeProps(props)});

    return main;
}

function snippet(component, props) {
    const components = Array.isArray(component) ? component : [{path: component, props}];
    return {
        type: 'snippet',
        components: components.map(c => ({path: locateComponent(c.path, 'snippet'), props: serializeProps(c.props)}))
    }
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

function locateComponent(component, type) {
    const relativePath = backtraceFilePath(type).substring(1);
    const relativeDir = relativePath.split('/').slice(0, -1).join('/');
    return (relativeDir + '/' + component).replaceAll('/./', '/');
}

function backtraceFilePath(type = 'render') {
    const rootPath = process.cwd();
    const stack = new Error().stack;
    const lines = stack.split('\n');
    const line = lines.findIndex(l => l.includes(`at ${type} (`));
    return lines[line+1].split(rootPath)[1].split(':')[0];
}


export {render, snippet, dictionary};