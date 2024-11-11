// @ts-nocheck
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { createRawSnippet, mount } from 'svelte';
import components from '@velmalabs/testsuite/.cache/components';

export function load() {
	let response = writable({ component: null, props: {} });
	if (browser) {
		window.render = (path: string, options?: { props?: Record<string, unknown> }) => {
			console.log(`render("${path}", ${JSON.stringify(options)})`);
			if (!components[path]) {
				throw new Error(`Component "${path}" does not exist`);
			}
			response.update((c) => ({
				...c,
				component: components[path],
				props: deserializeProps(options?.props ?? {})
			}));
		};
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
			};
		} else if (typeof value === 'object') {
			if (value.type === 'snippet') {
				acc[key] = renderSnippet(Object.values(value.components));
			} else {
				acc[key] = deserializeProps(value);
			}
		} else {
			acc[key] = value;
		}
		return acc;
	}, {});
}

function renderSnippet(entries) {
	return createRawSnippet(() => ({
		render: () => `<div></div>`,
		setup: (target) => {
			for (const snippet of entries) {
				const component = components[snippet.path];
				if (!component) {
					throw new Error(`Component "${snippet.path}" does not exist`);
				}
				mount(component, {
					target,
					props: deserializeProps(snippet.props)
				});
			}
			while (target.firstChild) {
				target.parentNode.insertBefore(target.firstChild, target);
			}
			target.remove();
		}
	}));
}
