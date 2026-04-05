/* empty css                                      */
import { c as createComponent, d as renderComponent, r as renderTemplate, b as createAstro, m as maybeRenderHead, F as Fragment, a as addAttribute } from '../chunks/astro/server_AM8BPPkk.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar, b as $$MobileNav } from '../chunks/MobileNav_C3kR4sjD.mjs';
import { a as getAllPlanPdfs, n as normalizeKey } from '../chunks/planLinks_DYuhDzJQ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$PlanesDeGobierno = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PlanesDeGobierno;
  const allPlans = getAllPlanPdfs();
  const requestedParty = Astro2.url.searchParams.get("partido") ?? "";
  const requestedKey = normalizeKey(requestedParty);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Planes de gobierno \xB7 Decide Per\xFA" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, { "currentPage": "candidatos" })} ${maybeRenderHead()}<main class="min-h-screen pb-24 md:pb-0"> <section class="pt-28 pb-16 md:pb-20"> <div class="mx-auto max-w-5xl space-y-8 px-6 lg:px-12"> <div class="space-y-4"> <div class="inline-flex items-center gap-2 rounded-[2rem] bg-secondary-container px-4 py-1.5 text-sm font-semibold tracking-wide text-on-secondary-container"> <span class="material-symbols-outlined text-sm">folder_open</span>
PLANES DE GOBIERNO
</div> <h1 class="font-headline text-4xl font-extrabold tracking-tight text-primary md:text-6xl">
Carpeta de planes en PDF
</h1> <p class="max-w-3xl text-lg leading-8 text-on-surface-variant">
Aquí tienes todos los planes de gobierno disponibles en el proyecto, cada uno en su PDF.
${requestedParty && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${" "}Has llegado buscando el partido <strong class="text-primary">${requestedParty}</strong>.
` })}`} </p> </div> <div class="grid gap-4 md:grid-cols-2"> ${allPlans.map((plan) => {
    const isRequested = requestedKey && plan.key === requestedKey;
    return renderTemplate`<a${addAttribute(plan.href, "href")} target="_blank" rel="noopener noreferrer"${addAttribute([
      "rounded-[1.5rem] border bg-surface-container-lowest p-5 shadow-[0_4px_40px_rgba(0,27,68,0.04)] transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_36px_rgba(0,27,68,0.08)]",
      isRequested ? "border-primary/30 ring-2 ring-primary/10" : "border-outline-variant/10"
    ], "class:list")}> <div class="flex items-start justify-between gap-4"> <div> <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/60">
Archivo PDF
</p> <h2 class="mt-1 font-headline text-xl font-extrabold text-primary"> ${plan.label} </h2> </div> <span class="material-symbols-outlined text-primary">open_in_new</span> </div> <p class="mt-3 text-sm leading-6 text-on-surface-variant">
Abrir documento del plan de gobierno.
</p> </a>`;
  })} </div> </div> </section> </main> ${renderComponent($$result2, "MobileNav", $$MobileNav, { "currentPage": "candidatos" })} ` })}`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/pages/planes-de-gobierno.astro", void 0);

const $$file = "/Users/lucas/Documents/GitHub/elecciones/src/pages/planes-de-gobierno.astro";
const $$url = "/planes-de-gobierno";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PlanesDeGobierno,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
