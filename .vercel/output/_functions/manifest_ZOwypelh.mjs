import 'piccolore';
import { l as decodeKey } from './chunks/astro/server_CNB8J8FW.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_FdjUkTi5.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/lucas/Documents/GitHub/elecciones/","cacheDir":"file:///Users/lucas/Documents/GitHub/elecciones/node_modules/.astro/","outDir":"file:///Users/lucas/Documents/GitHub/elecciones/dist/","srcDir":"file:///Users/lucas/Documents/GitHub/elecciones/src/","publicDir":"file:///Users/lucas/Documents/GitHub/elecciones/public/","buildClientDir":"file:///Users/lucas/Documents/GitHub/elecciones/dist/client/","buildServerDir":"file:///Users/lucas/Documents/GitHub/elecciones/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"candidatos/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/candidatos","isIndex":false,"type":"page","pattern":"^\\/candidatos\\/?$","segments":[[{"content":"candidatos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/candidatos.astro","pathname":"/candidatos","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"cuestionario/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/cuestionario","isIndex":false,"type":"page","pattern":"^\\/cuestionario\\/?$","segments":[[{"content":"cuestionario","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cuestionario.astro","pathname":"/cuestionario","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"planes-de-gobierno/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/planes-de-gobierno","isIndex":false,"type":"page","pattern":"^\\/planes-de-gobierno\\/?$","segments":[[{"content":"planes-de-gobierno","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/planes-de-gobierno.astro","pathname":"/planes-de-gobierno","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"predicciones/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/predicciones","isIndex":false,"type":"page","pattern":"^\\/predicciones\\/?$","segments":[[{"content":"predicciones","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/predicciones.astro","pathname":"/predicciones","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/polymarket/peru-election.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/polymarket\\/peru-election\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"polymarket","dynamic":false,"spread":false}],[{"content":"peru-election.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/polymarket/peru-election.json.ts","pathname":"/api/polymarket/peru-election.json","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/lucas/Documents/GitHub/elecciones/src/pages/candidatos.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/candidatos@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/lucas/Documents/GitHub/elecciones/src/pages/cuestionario.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/cuestionario@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/lucas/Documents/GitHub/elecciones/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/lucas/Documents/GitHub/elecciones/src/pages/planes-de-gobierno.astro",{"propagation":"none","containsHead":true}],["/Users/lucas/Documents/GitHub/elecciones/src/pages/predicciones.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/polymarket/peru-election.json@_@ts":"pages/api/polymarket/peru-election.json.astro.mjs","\u0000@astro-page:src/pages/candidatos@_@astro":"pages/candidatos.astro.mjs","\u0000@astro-page:src/pages/cuestionario@_@astro":"pages/cuestionario.astro.mjs","\u0000@astro-page:src/pages/planes-de-gobierno@_@astro":"pages/planes-de-gobierno.astro.mjs","\u0000@astro-page:src/pages/predicciones@_@astro":"pages/predicciones.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_ZOwypelh.mjs","/Users/lucas/Documents/GitHub/elecciones/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DPx82WJf.mjs","/Users/lucas/Documents/GitHub/elecciones/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/Users/lucas/Documents/GitHub/elecciones/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_DPHfhieJ.mjs","/Users/lucas/Documents/GitHub/elecciones/src/components/Navbar.astro?astro&type=script&index=0&lang.ts":"_astro/Navbar.astro_astro_type_script_index_0_lang.B-PQxU9C.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/lucas/Documents/GitHub/elecciones/src/components/Navbar.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"nav-share-btn\");async function c(){if(!t)return;const a=t.getAttribute(\"data-share-url\")||\"/\",o=t.getAttribute(\"data-share-title\")||document.title,i=t.getAttribute(\"data-share-text\")||\"\",e=new URL(a,window.location.origin).toString(),n={title:o,text:i,url:e};try{if(navigator.share){await navigator.share(n);return}if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(e),window.alert(\"Enlace copiado para compartir Decide Perú.\");return}window.prompt(\"Copia este enlace para compartir Decide Perú:\",e)}catch(r){if(r instanceof DOMException&&r.name===\"AbortError\")return;console.error(\"No se pudo compartir el enlace del test.\",r),window.prompt(\"Copia este enlace para compartir Decide Perú:\",e)}}t?.addEventListener(\"click\",c);"]],"assets":["/_astro/candidatos.D26Xu4JP.css","/mapa_electoral.png","/script.js","/planes-gobierno/APP.pdf","/planes-gobierno/APRA.pdf","/planes-gobierno/Ahora Nacion.pdf","/planes-gobierno/Avanza Pais.pdf","/planes-gobierno/Cooperacion Popular.pdf","/planes-gobierno/Democrata Verde.pdf","/planes-gobierno/Fe en el Peru.pdf","/planes-gobierno/Frente de la Esperanza.pdf","/planes-gobierno/Fuerza Popular.pdf","/planes-gobierno/Fuerza y Libertad.pdf","/planes-gobierno/Integridad Democratica.pdf","/planes-gobierno/JP.pdf","/planes-gobierno/Libertad Popular.pdf","/planes-gobierno/PBG.pdf","/planes-gobierno/PPP.pdf","/planes-gobierno/PRIN.pdf","/planes-gobierno/PTE.pdf","/planes-gobierno/Pais para Todos.pdf","/planes-gobierno/Partido Civico.pdf","/planes-gobierno/Partido Democrata Unido.pdf","/planes-gobierno/Partido Morado.pdf","/planes-gobierno/Peru Accion.pdf","/planes-gobierno/Peru Libre.pdf","/planes-gobierno/Peru Moderno.pdf","/planes-gobierno/Peru Primero.pdf","/planes-gobierno/Podemos Peru.pdf","/planes-gobierno/Progresamos.pdf","/planes-gobierno/Renovacion Popular.pdf","/planes-gobierno/Salvemos al Peru.pdf","/planes-gobierno/SiCreo.pdf","/planes-gobierno/Somos Peru.pdf","/planes-gobierno/Un Camino Diferente.pdf","/planes-gobierno/Unidad Nacional.pdf","/planes-gobierno/Unido Peru.pdf","/planes-gobierno/Venceremos.pdf","/img/candidatos/alfonso-lopez-chau.webp","/img/candidatos/alfredo-barnechea.webp","/img/candidatos/alvaro-paz.webp","/img/candidatos/antonio-ortiz.webp","/img/candidatos/armando-masse.webp","/img/candidatos/carlos-alvarez.webp","/img/candidatos/carlos-espa.webp","/img/candidatos/carlos-jaico.webp","/img/candidatos/cesar-acuna.webp","/img/candidatos/charlie-carrasco.webp","/img/candidatos/fernando-olivera.webp","/img/candidatos/fiorella-molinelli.webp","/img/candidatos/francisco-diez-canseco.webp","/img/candidatos/george-forsyth.webp","/img/candidatos/herbert-kaller.webp","/img/candidatos/joaquin-masse.webp","/img/candidatos/jorge-nieto.webp","/img/candidatos/jose-luna-galvez.webp","/img/candidatos/jose-williams.webp","/img/candidatos/keiko-fujimori.webp","/img/candidatos/lopez-aliaga.webp","/img/candidatos/mario-vizcarra.webp","/img/candidatos/marisol-perez-tello.webp","/img/candidatos/mesias-guevara.webp","/img/candidatos/napoleon-becerra.webp","/img/candidatos/paul-jaimes.webp","/img/candidatos/rafael-belaunde.webp","/img/candidatos/ricardo-belmont.webp","/img/candidatos/roberto-chiabra.webp","/img/candidatos/roberto-sanchez.webp","/img/candidatos/ronald-atencio.webp","/img/candidatos/rosario-fernandez.webp","/img/candidatos/vladimir-cerron.webp","/img/candidatos/walter-chirinos.webp","/img/candidatos/wolfgang-grozo.webp","/img/candidatos/yonhy-lescano.webp","/img/partidos/accion-popular.png","/img/partidos/ahora-nacion.jpg","/img/partidos/app.png","/img/partidos/avanza-pais.jpg","/img/partidos/cooperacion-popular.png","/img/partidos/fe-en-el-peru.png","/img/partidos/frente-de-la-esperanza.png","/img/partidos/fuerza-popular.png","/img/partidos/integridad-democratica.jpg","/img/partidos/juntos-por-el-peru.png","/img/partidos/libertad-popular.jpg","/img/partidos/obras.png","/img/partidos/pais-para-todos.jpg","/img/partidos/partido-democrata-unido-peru.jpg","/img/partidos/partido-democratico-federal.jpg","/img/partidos/partido-morado.png","/img/partidos/partido-patriotico-del-peru.png","/img/partidos/pbg.jpg","/img/partidos/peru-libre.png","/img/partidos/peru-primero.jpg","/img/partidos/podemos-peru.png","/img/partidos/prin.png","/img/partidos/progresemos.jpg","/img/partidos/pte.jpg","/img/partidos/renovacion-popular.png","/img/partidos/salvemos-al-peru.jpg","/img/partidos/somos-peru.png","/img/partidos/venceremos.png","/candidatos/index.html","/cuestionario/index.html","/planes-de-gobierno/index.html","/predicciones/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"MAVZpVKSXC1cCSIb0F7L9GEU+1kTyLuuljEujS9Zq9o="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
