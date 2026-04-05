import { c as createComponent, i as renderHead, j as renderSlot, r as renderTemplate, b as createAstro, m as maybeRenderHead, a as addAttribute, k as renderScript } from './astro/server_AM8BPPkk.mjs';
import 'piccolore';
import 'clsx';
/* empty css                              */

const $$Astro$2 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "Decide Per\xFA \xB7 Cuestionario electoral" } = Astro2.props;
  return renderTemplate`<html class="light" lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-background font-body text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/layouts/Layout.astro", void 0);

const $$Astro$1 = createAstro();
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Navbar;
  const { currentPage = "home" } = Astro2.props;
  const pageMeta = {
    home: {
      shareUrl: "/",
      shareTitle: "Decide Per\xFA \xB7 Inicio",
      shareText: "Explora Decide Per\xFA, haz el test electoral y revisa a los candidatos."
    },
    cuestionario: {
      shareUrl: "/cuestionario",
      shareTitle: "Decide Per\xFA \xB7 Cuestionario",
      shareText: "Haz el test de Decide Per\xFA y descubre qu\xE9 candidatura se alinea m\xE1s contigo."
    },
    predicciones: {
      shareUrl: "/predicciones",
      shareTitle: "Decide Per\xFA \xB7 Predicciones",
      shareText: "Revisa las predicciones en vivo de Decide Per\xFA con datos de Polymarket."
    },
    candidatos: {
      shareUrl: "/candidatos",
      shareTitle: "Decide Per\xFA \xB7 Candidatos",
      shareText: "Explora los perfiles y propuestas de cada candidatura en Decide Per\xFA."
    }
  };
  const { shareUrl, shareTitle, shareText } = pageMeta[currentPage];
  const navLinks = [
    { href: "/", label: "Inicio", icon: "home", page: "home" },
    { href: "/cuestionario", label: "Cuestionario", icon: "quiz", page: "cuestionario" },
    { href: "/predicciones", label: "Predicciones", icon: "analytics", page: "predicciones" },
    { href: "/candidatos", label: "Candidatos", icon: "groups", page: "candidatos" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="flex justify-between items-center w-full px-6 md:px-8 py-4 bg-surface/80 backdrop-blur-2xl border-b border-surface-container/50 fixed top-0 z-[60] font-headline tracking-tight"> <div class="text-xl font-bold text-primary uppercase tracking-wider">
Decide Perú
</div> <div class="hidden md:flex items-center gap-1"> ${navLinks.map((link) => renderTemplate`<a${addAttribute([
    "nav-link flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-semibold",
    currentPage === link.page ? "text-primary bg-primary/5 font-bold" : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
  ], "class:list")}${addAttribute(link.href, "href")}> <span class="material-symbols-outlined text-lg">${link.icon}</span> ${link.label} </a>`)} </div> <div class="flex items-center gap-3"> <button class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors font-semibold text-sm" type="button" id="nav-share-btn"${addAttribute(shareUrl, "data-share-url")}${addAttribute(shareTitle, "data-share-title")}${addAttribute(shareText, "data-share-text")} aria-label="Compartir Decide Perú"> <span class="material-symbols-outlined text-xl">share</span> <span class="hidden sm:inline">Compartir</span> </button> </div> </nav> ${renderScript($$result, "/Users/lucas/Documents/GitHub/elecciones/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/Navbar.astro", void 0);

const $$Astro = createAstro();
const $$MobileNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MobileNav;
  const { currentPage = "home" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white/80 backdrop-blur-xl border-t border-surface-container-low/20 shadow-[0_-4px_40px_rgba(0,27,68,0.04)] font-headline text-[10px] font-bold uppercase tracking-widest"> <a href="/"${addAttribute([
    "flex flex-col items-center justify-center rounded-lg px-5 py-2 transition-colors",
    currentPage === "home" ? "bg-primary text-white" : "text-primary/40 hover:text-primary"
  ], "class:list")}> <span class="material-symbols-outlined mb-0.5">home</span>
Inicio
</a> <a href="/cuestionario"${addAttribute([
    "flex flex-col items-center justify-center rounded-lg px-5 py-2 transition-colors",
    currentPage === "cuestionario" ? "bg-primary text-white" : "text-primary/40 hover:text-primary"
  ], "class:list")}> <span class="material-symbols-outlined mb-0.5">quiz</span>
Test
</a> <a href="/candidatos"${addAttribute([
    "flex flex-col items-center justify-center rounded-lg px-5 py-2 transition-colors",
    currentPage === "candidatos" ? "bg-primary text-white" : "text-primary/40 hover:text-primary"
  ], "class:list")}> <span class="material-symbols-outlined mb-0.5">groups</span>
Candidatos
</a> <a href="/predicciones"${addAttribute([
    "flex flex-col items-center justify-center rounded-lg px-5 py-2 transition-colors",
    currentPage === "predicciones" ? "bg-primary text-white" : "text-primary/40 hover:text-primary"
  ], "class:list")}> <span class="material-symbols-outlined mb-0.5">analytics</span>
Predicciones
</a> </nav>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/MobileNav.astro", void 0);

export { $$Layout as $, $$Navbar as a, $$MobileNav as b };
