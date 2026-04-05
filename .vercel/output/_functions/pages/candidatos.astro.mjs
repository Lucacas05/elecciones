/* empty css                                      */
import { c as createComponent, m as maybeRenderHead, a as addAttribute, r as renderTemplate, b as createAstro, d as renderComponent } from '../chunks/astro/server_AM8BPPkk.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Navbar, b as $$MobileNav } from '../chunks/MobileNav_C3kR4sjD.mjs';
import 'clsx';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { g as getPlanPdfHref } from '../chunks/planLinks_DYuhDzJQ.mjs';
import { g as getCollection } from '../chunks/_astro_content_CSNHDyxz.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$CandidateProfileCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CandidateProfileCard;
  const { candidate, index } = Astro2.props;
  const projectRoot = process.cwd();
  const hasPhoto = existsSync(join(projectRoot, "public", candidate.foto.replace(/^\//, "")));
  const logoBase = candidate.logo_partido.replace(/\.\w+$/, "");
  const logoExtensions = [".webp", ".png", ".jpg", ".jpeg"];
  let logoPath = candidate.logo_partido;
  let hasLogo = existsSync(join(projectRoot, "public", candidate.logo_partido.replace(/^\//, "")));
  if (!hasLogo) {
    for (const ext of logoExtensions) {
      const tryPath = logoBase + ext;
      if (existsSync(join(projectRoot, "public", tryPath.replace(/^\//, "")))) {
        logoPath = tryPath;
        hasLogo = true;
        break;
      }
    }
  }
  const planHref = getPlanPdfHref(candidate.partido);
  const initials = candidate.nombre.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
  const partyInitials = candidate.partido.split(" ").map((word) => word[0]).join("").slice(0, 3).toUpperCase();
  const topicDefinitions = [
    {
      key: "seguridad",
      label: "Seguridad",
      icon: "gavel",
      values: {
        mano_dura: "Mano dura y sanciones severas",
        reforma_institucional: "Reforma policial y judicial",
        prevencion: "Prevenci\xF3n y trabajo comunitario"
      }
    },
    {
      key: "economia",
      label: "Econom\xEDa",
      icon: "payments",
      values: {
        libre_mercado: "Libre mercado y menor regulaci\xF3n",
        intervencion_estatal: "Mayor intervenci\xF3n estatal",
        mixta: "Equilibrio entre mercado y regulaci\xF3n"
      }
    },
    {
      key: "educacion",
      label: "Educaci\xF3n",
      icon: "school",
      values: {
        publica_prioridad: "Prioridad a la educaci\xF3n p\xFAblica",
        privada_incentivo: "Impulso a la educaci\xF3n privada",
        mixta: "Mejora combinada del sistema"
      }
    },
    {
      key: "salud",
      label: "Salud",
      icon: "health_and_safety",
      values: {
        sistema_universal: "Sistema universal",
        privado_complementario: "Privado como complemento",
        mixto: "Integraci\xF3n del sistema mixto"
      }
    },
    {
      key: "corrupcion",
      label: "Corrupci\xF3n",
      icon: "policy",
      values: {
        pena_muerte: "Pena m\xE1xima como respuesta",
        cadena_perpetua: "Cadena perpetua e inhabilitaci\xF3n",
        reforma_judicial: "Reforma judicial y fiscal"
      }
    },
    {
      key: "mineria",
      label: "Miner\xEDa",
      icon: "landscape",
      values: {
        pro_mineria: "Promoci\xF3n de inversi\xF3n minera",
        regulacion_estricta: "Regulaci\xF3n ambiental estricta",
        consulta_previa: "Consulta previa obligatoria"
      }
    },
    {
      key: "descentralizacion",
      label: "Descentralizaci\xF3n",
      icon: "location_city",
      values: {
        mas_poder_regiones: "M\xE1s poder para regiones",
        gobierno_central: "Mayor control desde Lima",
        gradual: "Transferencia gradual con asistencia"
      }
    },
    {
      key: "politica_social",
      label: "Pol\xEDtica social",
      icon: "diversity_3",
      values: {
        bonos_directos: "Bonos y transferencias directas",
        programas_empleo: "Programas p\xFAblicos de empleo",
        educacion_tecnica: "Formaci\xF3n t\xE9cnica y empleo"
      }
    }
  ];
  const topicEntries = topicDefinitions.map((topic) => ({
    ...topic,
    value: topic.values[candidate.quiz_posiciones[topic.key]] ?? "Posici\xF3n no definida"
  }));
  return renderTemplate`${maybeRenderHead()}<article class="space-y-6"> <div class="institutional-gradient relative overflow-hidden rounded-[2rem] p-7 md:p-10 shadow-[0_20px_60px_rgba(0,27,68,0.16)]"> <div class="absolute top-[-64px] right-[-36px] h-56 w-56 rounded-full bg-white/5"></div> <div class="absolute bottom-[-92px] left-[-32px] h-44 w-44 rounded-full bg-white/5"></div> <div class="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-start"> <div class="space-y-5"> <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/80"> <span class="material-symbols-outlined text-sm">verified</span>
Candidatura ${String(index + 1).padStart(2, "0")} </div> <div class="flex flex-wrap items-center gap-4"> <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white"> ${hasLogo ? renderTemplate`<img${addAttribute(logoPath, "src")}${addAttribute(`Logo de ${candidate.partido}`, "alt")} class="h-full w-full object-contain p-1" loading="lazy">` : renderTemplate`<span class="font-headline text-lg font-extrabold tracking-[0.18em] text-primary/70"> ${partyInitials} </span>`} </div> <div class="space-y-1"> <h2 class="font-headline text-3xl font-extrabold tracking-tight text-white md:text-4xl"> ${candidate.nombre} </h2> <p class="text-sm font-semibold uppercase tracking-[0.16em] text-white/80"> ${candidate.partido} </p> </div> </div> <p class="max-w-3xl text-sm leading-7 text-white/90 md:text-base"> ${candidate.profesion} · ${candidate.experiencia_politica} </p> <div class="flex flex-wrap gap-2"> <span class="rounded-full bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white"> ${candidate.edad} años
</span> </div> </div> <div class="rounded-[1.75rem] border border-white/12 bg-white/8 p-5 backdrop-blur-sm md:p-6"> <div class="flex items-start gap-4"> <div class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/14 bg-white/10"> ${hasPhoto ? renderTemplate`<img${addAttribute(candidate.foto, "src")}${addAttribute(candidate.nombre, "alt")} class="h-full w-full object-cover" loading="lazy">` : renderTemplate`<span class="font-headline text-3xl font-extrabold tracking-[0.08em] text-white/82"> ${initials} </span>`} </div> <div class="space-y-2"> <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
Dato clave
</p> <p class="text-sm leading-6 text-white/90"> ${candidate.dato_clave} </p> </div> </div> <div class="mt-5 grid gap-3 sm:grid-cols-2"> <div class="rounded-2xl bg-white/10 px-4 py-3"> <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Profesión</p> <p class="mt-1 text-sm font-semibold text-white">${candidate.profesion}</p> </div> <div class="rounded-2xl bg-white/10 px-4 py-3"> <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Partido</p> <p class="mt-1 text-sm font-semibold text-white">${candidate.partido}</p> </div> </div> </div> </div> </div> <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"> <section class="rounded-[1.75rem] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_4px_40px_rgba(0,27,68,0.04)] md:p-8"> <div class="mb-6 flex items-center gap-3"> <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined">format_list_bulleted</span> </div> <div> <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60">Lectura rápida</p> <h3 class="font-headline text-2xl font-extrabold text-primary">Propuestas destacadas</h3> </div> </div> <ul class="space-y-4"> ${candidate.propuestas.map((propuesta) => renderTemplate`<li class="flex gap-3 rounded-2xl bg-surface-container-low px-4 py-4 text-sm leading-6 text-on-surface-variant"> <span class="mt-0.5 text-primary">→</span> <span>${propuesta}</span> </li>`)} </ul> <div class="mt-6 flex flex-wrap gap-3"> <a${addAttribute(planHref, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary transition-all hover:bg-primary-container"> <span class="material-symbols-outlined text-lg">description</span>
Ver plan de gobierno
</a> </div> </section> <section class="rounded-[1.75rem] border border-outline-variant/10 bg-surface-container-low p-6 shadow-[0_4px_40px_rgba(0,27,68,0.04)] md:p-8"> <div class="mb-6 flex items-center gap-3"> <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary"> <span class="material-symbols-outlined">hub</span> </div> <div> <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60">Perfil programático</p> <h3 class="font-headline text-2xl font-extrabold text-primary">Posiciones por tema</h3> </div> </div> <div class="grid gap-3 md:grid-cols-2"> ${topicEntries.map((topic) => renderTemplate`<div class="rounded-2xl border border-outline-variant/10 bg-white/70 px-4 py-4"> <div class="mb-2 flex items-center gap-2"> <span class="material-symbols-outlined text-base text-primary">${topic.icon}</span> <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70"> ${topic.label} </p> </div> <p class="text-sm leading-6 text-on-surface-variant"> ${topic.value} </p> </div>`)} </div> <div class="mt-6 rounded-[1.5rem] border border-dashed border-outline-variant/25 bg-white/50 px-4 py-4"> <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/60">
Siguiente paso
</p> <p class="mt-2 text-sm leading-6 text-on-surface-variant">
Si quieres ver qué tan cerca estás de este perfil, vuelve al cuestionario y compara tus respuestas.
</p> <a href="/cuestionario" class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary underline decoration-primary/30 underline-offset-4"> <span class="material-symbols-outlined text-lg">compare_arrows</span>
Comparar con mis respuestas
</a> </div> </section> </div> </article>`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/components/CandidateProfileCard.astro", void 0);

const $$Candidatos = createComponent(async ($$result, $$props, $$slots) => {
  const allCandidatos = await getCollection("candidatos");
  const candidatos = allCandidatos.map((entry) => entry.data).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Candidatos \xB7 Decide Per\xFA" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", $$Navbar, { "currentPage": "candidatos" })} ${maybeRenderHead()}<main class="min-h-screen pb-24 md:pb-0"> <section class="pt-28 pb-14 md:pb-20"> <div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:px-12"> <div class="inline-flex w-fit items-center gap-2 rounded-[2rem] bg-secondary-container px-4 py-1.5 text-sm font-semibold tracking-wide text-on-secondary-container"> <span class="material-symbols-outlined text-sm">groups</span>
PERFILES DE CANDIDATURA
</div> <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"> <div class="space-y-5"> <h1 class="max-w-4xl font-headline text-5xl font-extrabold leading-[1.05] tracking-tight text-primary lg:text-7xl">
Candidatos para mirar con más contexto
</h1> <p class="max-w-2xl text-lg leading-8 text-on-surface-variant">
Esta página reemplaza el acceso a metodología: aquí puedes revisar el perfil de cada candidatura,
              sus propuestas principales y su posición por tema antes de hacer el test.
</p> </div> <div class="rounded-[1.75rem] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-[0_4px_40px_rgba(0,27,68,0.04)] md:p-8"> <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-primary/60">
Cómo usar esta vista
</p> <div class="mt-4 space-y-4"> <div class="flex items-start gap-3"> <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined text-base">visibility</span> </div> <p class="text-sm leading-6 text-on-surface-variant">
Revisa partido, trayectoria y propuestas clave de cada candidatura.
</p> </div> <div class="flex items-start gap-3"> <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined text-base">hub</span> </div> <p class="text-sm leading-6 text-on-surface-variant">
Usa el bloque de posiciones por tema para entender rápidamente el enfoque programático.
</p> </div> <div class="flex items-start gap-3"> <div class="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container"> <span class="material-symbols-outlined text-base">quiz</span> </div> <p class="text-sm leading-6 text-on-surface-variant">
Luego vuelve al cuestionario y compara tus respuestas con cada perfil.
</p> </div> </div> </div> </div> </div> </section> <section class="pb-20"> <div class="mx-auto max-w-6xl space-y-10 px-6 lg:px-12"> ${candidatos.map((candidate, index) => renderTemplate`${renderComponent($$result2, "CandidateProfileCard", $$CandidateProfileCard, { "candidate": candidate, "index": index })}`)} </div> </section> </main> ${renderComponent($$result2, "MobileNav", $$MobileNav, { "currentPage": "candidatos" })} ` })}`;
}, "/Users/lucas/Documents/GitHub/elecciones/src/pages/candidatos.astro", void 0);

const $$file = "/Users/lucas/Documents/GitHub/elecciones/src/pages/candidatos.astro";
const $$url = "/candidatos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Candidatos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
