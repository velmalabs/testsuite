import fg from "fast-glob";
import {dirname} from 'node:path';
import {spawn} from 'node:child_process';
import playwrightConfig from "../../velmalabs.config.js";
import {readFileSync, writeFileSync, copyFileSync, cpSync, unlinkSync, rmSync, existsSync} from 'node:fs';


export const program = {
    run: async (args) => {
        console.log('Booting Suite...');
        const files = await findTestFiles();
        const components = collectComponents(files);
        prepare(components);
        run(args);
    }
}


function findTestFiles() {
    return fg(playwrightConfig.testMatch);
}

function collectComponents(files) {
    return Array.from(files.reduce((output, file) => new Set([...output, ...extractComponents(file)]), new Set([])));
}

function extractComponents(file) {
    let relativePath = dirname(file);
    const parts = readFileSync(file, 'utf-8').split('.svelte');
    return parts.map((p, i) => {
        if (!parts[i + 1]?.startsWith('"') && !parts[i + 1]?.startsWith("'")) {
            return false;
        }
        const comma = parts[i + 1].indexOf('"') > -1 ? '"' : "'";
        return p.split(comma).slice(-1)[0] + '.svelte';
    }).filter(c => !!c && c !== '.svelte').map(component => {
        return `${relativePath}/${component}`.replaceAll('/./', '/');
    });
}


function prepare(components) {
    console.log('Prepare Suite...')
    copyFileSync(import.meta.dirname + '/../../velmalabs.config.js', 'velmalabs.config.ts');
    cpSync(import.meta.dirname + '/../suite', 'src/routes/__testsuite__', {recursive: true});
    writeFileSync('src/routes/__testsuite__/tree.ts', components.map((c, i) => `import C${i} from '../../../${c}';`).join('\n') + '\n' + 'export default {\n' + components.map((c, i) => `\t"${c}":C${i}`).join(',\n') + '\n' + '};\n');
}

function cleanup() {
    console.log('\nCleanup Suite...');
    if (existsSync('velmalabs.config.ts')) {
        unlinkSync('velmalabs.config.ts');
    }
    if (existsSync('src/routes/__testsuite__')) {
        rmSync('src/routes/__testsuite__', {recursive: true});
    }
    process.exit(0);
}

function run(args) {
    console.log('Start playwright...');
    args = args.slice(2);
    process.on('SIGINT', () => cleanup());
    const sub = spawn('playwright', ['test', ...args, '-c', 'velmalabs.config.ts']);
    sub.stdout.on('data', (err) => console.log(err.toString()))
    sub.stderr.on('data', (err) => console.error(err.toString()))
    sub.on('exit', () => cleanup());
}