/* empty css                                      */
import { c as createComponent, m as maybeRenderHead, r as renderTemplate, d as renderComponent } from '../chunks/astro/server_AM8BPPkk.mjs';
import 'piccolore';
import { $ as $$Layout, b as $$MobileNav, a as $$Navbar } from '../chunks/MobileNav_C3kR4sjD.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$PolymarketSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="predicciones" class="py-16 md:py-24"> <div class="max-w-6xl mx-auto px-6 lg:px-12"> <div class="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-surface-container-lowest px-6 py-8 shadow-[0_20px_60px_rgba(0,27,68,0.08)] md:px-8 md:py-10"> <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div> <div class="absolute bottom-[-2rem] left-[-1rem] h-32 w-32 rounded-full bg-secondary-container/60 blur-3xl"></div> <div class="relative z-10 flex flex-col gap-8"> <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"> <div class="max-w-3xl space-y-4"> <div class="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary"> <span class="relative flex h-2.5 w-2.5"> <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70"></span> <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span> </span>
Mercado predictivo en vivo
</div> <div> <h2 class="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
Predicciones en tiempo real de Polymarket
</h2> <p class="mt-3 max-w-2xl text-base leading-7 text-on-surface-variant md:text-lg">
Sigue cómo se mueve ahora mismo el mercado predictivo sobre la presidencia de Perú
                y usa esta referencia como contexto adicional para entender el clima electoral.
</p> </div> </div> <div class="flex flex-wrap items-center gap-3"> <span id="polymarket-status" class="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"> <span class="h-2 w-2 rounded-full bg-primary/40"></span>
Cargando
</span> <button id="polymarket-refresh" type="button" class="inline-flex items-center gap-2 rounded-xl border border-primary/10 bg-white px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"> <span class="material-symbols-outlined text-base">refresh</span>
Actualizar
</button> <a href="https://polymarket.com/es/event/peru-presidential-election-winner" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-container"> <span class="material-symbols-outlined text-base">open_in_new</span>
Abrir Polymarket
</a> </div> </div> <div id="polymarket-board"> <article class="rounded-[1.75rem] border border-outline-variant/10 bg-surface p-6 md:p-7"> <div class="animate-pulse space-y-4"> <div class="h-3 w-40 rounded-full bg-primary/10"></div> <div class="h-10 w-64 rounded-2xl bg-primary/10"></div> <div class="space-y-3"> <div class="h-20 rounded-2xl bg-primary/10"></div> <div class="h-20 rounded-2xl bg-primary/10"></div> <div class="h-20 rounded-2xl bg-primary/10"></div> </div> </div> </article> </div> <div class="flex flex-col gap-2 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between"> <p id="polymarket-meta">Sincronizando datos del mercado de Polymarket…</p> <p class="max-w-2xl leading-6">
Referencia rápida del mercado predictivo: no es una encuesta tradicional. Refleja el precio implícito de la apuesta en Polymarket.
</p> </div> </div> </div> </div> </section>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/PolymarketSection.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Predicciones = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Decide Per\xFA \xB7 Predicciones" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<main class="min-h-screen pb-24 md:pb-0"> <section class="pt-28 pb-6"> <div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:px-12"> <div class="inline-flex w-fit items-center gap-2 rounded-[2rem] bg-secondary-container px-4 py-1.5 text-sm font-semibold tracking-wide text-on-secondary-container"> <span class="material-symbols-outlined text-sm">query_stats</span>\nMERCADO PREDICTIVO\n</div> <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"> <div class="space-y-5"> <h1 class="max-w-4xl font-headline text-5xl font-extrabold leading-[1.05] tracking-tight text-primary lg:text-7xl">\nSigue las predicciones del mercado en tiempo real\n</h1> <p class="max-w-2xl text-lg leading-8 text-on-surface-variant">\nAqu\xED ves la se\xF1al del mercado predictivo de Polymarket para la presidencia de Per\xFA,\n              separada del test para que la navegaci\xF3n sea m\xE1s clara.\n</p> </div> <div class="rounded-[1.75rem] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_4px_40px_rgba(0,27,68,0.04)] md:p-8"> <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/60">\nC\xF3mo leer esta p\xE1gina\n</p> <div class="mt-4 space-y-4"> <div class="flex items-start gap-3"> <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined text-base">monitoring</span> </div> <p class="text-sm leading-6 text-on-surface-variant">\nLos porcentajes reflejan precios impl\xEDcitos del mercado, no intenci\xF3n de voto oficial.\n</p> </div> <div class="flex items-start gap-3"> <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined text-base">update</span> </div> <p class="text-sm leading-6 text-on-surface-variant">\nLa vista se actualiza autom\xE1ticamente y tambi\xE9n puedes refrescarla manualmente.\n</p> </div> <div class="flex items-start gap-3"> <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined text-base">open_in_new</span> </div> <p class="text-sm leading-6 text-on-surface-variant">\nSi quieres m\xE1s detalle, abre el mercado original desde el bot\xF3n de Polymarket.\n</p> </div> </div> </div> </div> </div> </section> ', " </main> ", ' <script src="/script.js"><\/script> '])), renderComponent($$result2, "Navbar", $$Navbar, { "currentPage": "predicciones" }), maybeRenderHead(), renderComponent($$result2, "PolymarketSection", $$PolymarketSection, {}), renderComponent($$result2, "MobileNav", $$MobileNav, { "currentPage": "predicciones" })) })}`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/pages/predicciones.astro", void 0);

const $$file = "/Users/lucas/Documents/GitHub/elecciones/src/pages/predicciones.astro";
const $$url = "/predicciones";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Predicciones,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
