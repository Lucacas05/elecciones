/* empty css                                      */
import { c as createComponent, m as maybeRenderHead, r as renderTemplate, d as renderComponent, e as defineScriptVars } from '../chunks/astro/server_AM8BPPkk.mjs';
import 'piccolore';
import { $ as $$Layout, b as $$MobileNav, a as $$Navbar } from '../chunks/MobileNav_C3kR4sjD.mjs';
import 'clsx';
import { g as getCollection } from '../chunks/_astro_content_CSNHDyxz.mjs';
export { renderers } from '../renderers.mjs';

const $$QuestionnaireSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="cuestionario" class="py-16 md:py-24"> <div class="max-w-2xl mx-auto px-6 lg:px-8"> <div class="text-center mb-10"> <p class="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-3">Tus prioridades</p> <h2 class="font-headline text-3xl md:text-4xl font-extrabold text-primary mb-4">
Cuestionario ciudadano
</h2> <p class="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
Elige la opción que mejor represente tu postura en cada tema.
        Al terminar, verás qué candidatura se alinea más contigo.
</p> </div> <div class="quiz-shell"> <div class="quiz-shell-header"> <div class="flex items-center gap-3"> <div class="quiz-icon-box"> <span class="material-symbols-outlined text-primary" style="font-size:20px">quiz</span> </div> <span class="font-headline font-bold text-primary text-sm">8 temas clave</span> </div> <div class="text-right"> <p class="text-[11px] uppercase tracking-[0.2em] text-on-surface-variant font-medium">Respuestas</p> <p id="answers-count" class="font-headline text-2xl font-extrabold text-primary tabular-nums">0/8</p> </div> </div> <form id="questionnaire-form" class="quiz-form"></form> <div class="quiz-actions"> <button id="submit-button" type="submit" form="questionnaire-form" class="quiz-btn-primary"> <span class="material-symbols-outlined text-lg">analytics</span>
Ver resultados
</button> <button id="reset-button" type="button" class="quiz-btn-secondary">
Reiniciar
</button> </div> </div> </div> </section>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/QuestionnaireSection.astro", void 0);

const $$ResultsSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="tu-resultado" class="bg-surface-container-low py-16 md:py-24 hidden" data-results-section> <div class="max-w-6xl mx-auto px-6 lg:px-12 space-y-8"> <div class="text-center mb-4"> <p class="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-3">Tu perfil</p> <h2 class="font-headline text-3xl md:text-4xl font-extrabold text-primary mb-4">
Tu resultado principal
</h2> <p class="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
Este bloque aparece cuando respondes el test y muestra la candidatura con mayor afinidad según tus respuestas.
</p> </div> <article id="top-match" class="results-shell institutional-gradient rounded-[2rem] p-7 md:p-10 text-white overflow-hidden relative shadow-[0_20px_60px_rgba(0,27,68,0.18)]"></article> </div> </section>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/ResultsSection.astro", void 0);

const $$RankingSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="comparativa" class="py-16 md:py-24 hidden" data-results-section> <div class="max-w-6xl mx-auto px-6 lg:px-12"> <div class="text-center mb-12"> <p class="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-3">Coincidencias</p> <h2 class="font-headline text-3xl md:text-4xl font-extrabold text-primary mb-4">
Ranking de afinidad
</h2> <p class="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
Se actualiza en tiempo real con cada cambio en tus respuestas.
</p> </div> <div class="bg-surface-container-lowest rounded-2xl p-6 md:p-10 shadow-[0_4px_40px_rgba(0,27,68,0.04)]"> <div id="results-list" class="space-y-4"></div> </div> </div> </section>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/RankingSection.astro", void 0);

const $$BreakdownSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="bg-surface-container-low py-16 md:py-24 hidden" data-results-section> <div class="max-w-6xl mx-auto px-6 lg:px-12"> <div class="text-center mb-12"> <p class="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-3">Lectura por tema</p> <h2 class="font-headline text-3xl md:text-4xl font-extrabold text-primary mb-4">
Dónde coincides más
</h2> <p class="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
Análisis detallado de tu coincidencia en cada uno de los ocho ejes temáticos.
</p> </div> <div id="issue-breakdown" class="space-y-6"></div> </div> </section>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/BreakdownSection.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Cuestionario = createComponent(async ($$result, $$props, $$slots) => {
  const allCandidatos = await getCollection("candidatos");
  const candidatosData = allCandidatos.map((c) => c.data);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Decide Per\xFA \xB7 Cuestionario" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<main class="min-h-screen pb-24 md:pb-0"> <section class="pt-28 pb-6"> <div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:px-12"> <div class="inline-flex w-fit items-center gap-2 rounded-[2rem] bg-secondary-container px-4 py-1.5 text-sm font-semibold tracking-wide text-on-secondary-container"> <span class="material-symbols-outlined text-sm">quiz</span>\nTEST DE AFINIDAD ELECTORAL\n</div> <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"> <div class="space-y-5"> <h1 class="max-w-4xl font-headline text-5xl font-extrabold leading-[1.05] tracking-tight text-primary lg:text-7xl">\nHaz el test y descubre tu afinidad pol\xEDtica\n</h1> <p class="max-w-2xl text-lg leading-8 text-on-surface-variant">\nResponde los ocho temas clave, genera tu ranking de afinidad y revisa en qu\xE9 ejes\n              coincides m\xE1s con cada candidatura.\n</p> </div> <div class="rounded-[1.75rem] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_4px_40px_rgba(0,27,68,0.04)] md:p-8"> <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/60">\nAntes de empezar\n</p> <div class="mt-4 space-y-4"> <div class="flex items-start gap-3"> <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined text-base">visibility</span> </div> <p class="text-sm leading-6 text-on-surface-variant">\nTus respuestas se guardan solo en tu navegador para que puedas retomar el test.\n</p> </div> <div class="flex items-start gap-3"> <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined text-base">leaderboard</span> </div> <p class="text-sm leading-6 text-on-surface-variant">\nAl finalizar ver\xE1s tu coincidencia principal, el ranking completo y el detalle por tema.\n</p> </div> <div class="flex items-start gap-3"> <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined text-base">groups</span> </div> <p class="text-sm leading-6 text-on-surface-variant">\nSi quieres m\xE1s contexto antes de responder, revisa primero la p\xE1gina de candidatos.\n</p> </div> </div> <a href="/candidatos" class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary underline decoration-primary/30 underline-offset-4">\nVer perfiles de candidatura\n<span class="material-symbols-outlined text-base">arrow_forward</span> </a> </div> </div> </div> </section> ', " ", " ", " ", " </main> ", " <script>(function(){", '\n    window.__CANDIDATOS_DATA__ = candidatosData;\n  })();<\/script> <script src="/script.js"><\/script> '])), renderComponent($$result2, "Navbar", $$Navbar, { "currentPage": "cuestionario" }), maybeRenderHead(), renderComponent($$result2, "QuestionnaireSection", $$QuestionnaireSection, {}), renderComponent($$result2, "ResultsSection", $$ResultsSection, {}), renderComponent($$result2, "RankingSection", $$RankingSection, {}), renderComponent($$result2, "BreakdownSection", $$BreakdownSection, {}), renderComponent($$result2, "MobileNav", $$MobileNav, { "currentPage": "cuestionario" }), defineScriptVars({ candidatosData })) })}`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/pages/cuestionario.astro", void 0);

const $$file = "/Users/lucas/Documents/GitHub/elecciones/src/pages/cuestionario.astro";
const $$url = "/cuestionario";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cuestionario,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
