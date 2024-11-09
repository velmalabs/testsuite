// @ts-nocheck

import {browser} from "$app/environment";
import components from "./tree";
import {writable} from "svelte/store";

export function load() {
    let response = writable({component: null, props: {}});
    if (browser) {
        window.render = (path: string, options: { props: {} }) => {
            response.update(c => ({
                ...c,
                component: components[path],
                props: deserializeProps(options?.props ?? {})
            }));
        }
        if (window.renderLoaded) {
            window.renderLoaded();
        }
    }

    return response;
}


function deserializeProps(props: object) {
    return Object.entries(props).reduce((acc, [key, value]) => {
        if (typeof value === 'string' && value.startsWith('__FN__:')) {
            acc[key] = (...args) => {
                const functionString = value.slice(7);
                return new Function('args', `return (${functionString})(...args);`)(args);
            }
        } else if (typeof value === 'object') {
            acc[key] = deserializeProps(value);
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});
}