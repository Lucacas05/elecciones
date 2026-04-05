/* empty css                                      */
import { c as createComponent, m as maybeRenderHead, r as renderTemplate, d as renderComponent } from '../chunks/astro/server_AM8BPPkk.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar, b as $$MobileNav } from '../chunks/MobileNav_C3kR4sjD.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header id="inicio" class="pt-28 pb-16 md:pb-24"> <div class="max-w-6xl mx-auto px-6 lg:px-12"> <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-[2rem] bg-secondary-container text-on-secondary-container font-label text-sm font-semibold tracking-wide mb-8"> <span class="relative flex h-2 w-2"> <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-tertiary-container opacity-75"></span> <span class="relative inline-flex rounded-full h-2 w-2 bg-on-tertiary-container"></span> </span>
TEST DE AFINIDAD ELECTORAL
</div> <div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start"> <div class="space-y-6"> <h1 class="font-headline text-5xl lg:text-7xl font-extrabold text-primary leading-[1.08] tracking-tight">
Descubre con qué candidatura
<span class="text-primary-container relative">
coincides más
<span class="absolute bottom-0 left-0 w-full h-2 bg-primary-container/10 -z-10"></span> </span> </h1> <p class="font-body text-on-surface-variant max-w-2xl text-lg leading-relaxed">
Responde tus prioridades en ocho temas clave, compara perfiles
          programáticos y revisa tus resultados de forma clara antes de decidir.
</p> <div class="pt-2 flex flex-col sm:flex-row items-start gap-4"> <a href="/cuestionario" class="px-8 py-5 bg-primary text-on-primary rounded-xl font-headline font-bold text-lg hover:bg-primary-container transition-all active:scale-95 shadow-xl shadow-primary/10">
Comenzar el Test
</a> <a href="/candidatos" class="px-8 py-5 bg-surface-container-low text-primary rounded-xl font-headline font-bold text-lg hover:bg-surface-container-high transition-all">
Ver Candidatos
</a> </div> </div> <section class="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_4px_40px_rgba(0,27,68,0.04)]"> <div class="flex items-start gap-4 mb-6"> <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"> <span class="material-symbols-outlined">how_to_vote</span> </div> <div class="space-y-2"> <h2 class="font-headline text-lg font-extrabold text-primary">
Cómo leer tu resultado
</h2> <p class="text-sm text-on-surface-variant leading-6">
El porcentaje indica cercanía entre tus respuestas y el perfil
              programático de cada candidatura cargada en el código.
</p> </div> </div> <div class="space-y-3"> <div class="flex items-center gap-3 p-3 bg-surface-container-low/50 rounded-xl"> <div class="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center"> <span class="material-symbols-outlined text-on-secondary-container text-sm">shield_person</span> </div> <span class="text-sm font-semibold text-on-surface-variant">Algoritmo neutral basado en datos</span> </div> <div class="flex items-center gap-3 p-3 bg-surface-container-low/50 rounded-xl"> <div class="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center"> <span class="material-symbols-outlined text-on-secondary-container text-sm">visibility_lock</span> </div> <span class="text-sm font-semibold text-on-surface-variant">Tus datos no se guardan en servidor</span> </div> </div> </section> </div> </div> </header>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/HeroSection.astro", void 0);

const $$StepsSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section id="como-funciona" class="bg-surface-container-low py-16 md:py-24"> <div class="max-w-6xl mx-auto px-6 lg:px-12"> <div class="text-center mb-12 space-y-3"> <h2 class="font-headline text-3xl font-bold text-primary">Cómo funciona</h2> <p class="text-on-surface-variant font-body max-w-lg mx-auto">
Tres pasos simples para descubrir tu afinidad electoral.
</p> </div> <div class="grid sm:grid-cols-3 gap-8"> <article class="bg-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col gap-6"> <div class="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container"> <span class="material-symbols-outlined text-3xl">edit_note</span> </div> <div> <p class="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-2">Paso 1</p> <h3 class="font-headline text-xl font-extrabold text-primary mb-3">Responde</h3> <p class="text-on-surface-variant leading-relaxed">
Marca tu postura en ocho temas clave del debate público peruano.
</p> </div> </article> <article class="bg-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col gap-6"> <div class="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container"> <span class="material-symbols-outlined text-3xl">groups</span> </div> <div> <p class="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-2">Paso 2</p> <h3 class="font-headline text-xl font-extrabold text-primary mb-3">Explora</h3> <p class="text-on-surface-variant leading-relaxed">
Entra a la página de candidatos y revisa el perfil, partido y propuestas clave de cada candidatura.
</p> </div> </article> <article class="bg-surface-container-lowest p-8 rounded-2xl shadow-sm flex flex-col gap-6"> <div class="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container"> <span class="material-symbols-outlined text-3xl">analytics</span> </div> <div> <p class="text-xs font-bold uppercase tracking-[0.22em] text-primary mb-2">Paso 3</p> <h3 class="font-headline text-xl font-extrabold text-primary mb-3">Decide con contexto</h3> <p class="text-on-surface-variant leading-relaxed">
Responde el test y usa tu ranking de afinidad como una guía rápida antes de profundizar en fuentes oficiales.
</p> </div> </article> </div> </div> </section>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/StepsSection.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Decide Per\xFA \xB7 Inicio" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, { "currentPage": "home" })} ${maybeRenderHead()}<main class="min-h-screen pb-24 md:pb-0"> ${renderComponent($$result2, "HeroSection", $$HeroSection, {})} ${renderComponent($$result2, "StepsSection", $$StepsSection, {})} </main> ${renderComponent($$result2, "MobileNav", $$MobileNav, { "currentPage": "home" })} ` })}`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/pages/index.astro", void 0);

const $$file = "/Users/lucas/Documents/GitHub/elecciones/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
