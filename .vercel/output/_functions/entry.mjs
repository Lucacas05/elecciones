import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DsTxXgdj.mjs';
import { manifest } from './manifest_B7D9h21A.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/polymarket/peru-election.json.astro.mjs');
const _page2 = () => import('./pages/candidatos.astro.mjs');
const _page3 = () => import('./pages/cuestionario.astro.mjs');
const _page4 = () => import('./pages/planes-de-gobierno.astro.mjs');
const _page5 = () => import('./pages/predicciones.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/polymarket/peru-election.json.ts", _page1],
    ["src/pages/candidatos.astro", _page2],
    ["src/pages/cuestionario.astro", _page3],
    ["src/pages/planes-de-gobierno.astro", _page4],
    ["src/pages/predicciones.astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "d3414215-5f13-46d7-8cac-8656c355e23a",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
