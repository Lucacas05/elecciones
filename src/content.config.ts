import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const candidatos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './candidatos' }),
  schema: z.object({
    nombre: z.string(),
    partido: z.string(),
    logo_partido: z.string(),
    foto: z.string(),
    edad: z.number(),
    profesion: z.string(),
    experiencia_politica: z.string(),
    propuestas: z.array(z.string()),
    dato_clave: z.string(),
    partido_ideologia: z.string(),
    plan_gobierno_url: z.string(),
    hoja_vida_url: z.string(),
    quiz_posiciones: z.object({
      seguridad: z.string(),
      economia: z.string(),
      educacion: z.string(),
      salud: z.string(),
      corrupcion: z.string(),
      mineria: z.string(),
      descentralizacion: z.string(),
      politica_social: z.string(),
    }),
  }),
});

export const collections = { candidatos };
