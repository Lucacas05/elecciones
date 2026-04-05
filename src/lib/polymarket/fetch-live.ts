import { normalizeGammaEvent } from './normalize';
import {
  POLYMARKET_EVENT_URL,
  POLYMARKET_USER_AGENT,
  type GammaEvent,
  type LoggerLike,
  type PolymarketEventSnapshot,
} from './types';

export interface FetchLivePolymarketOptions {
  fetchImpl?: typeof fetch;
  logger?: LoggerLike;
  timeoutMs?: number;
  retries?: number;
  retryDelaysMs?: number[];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { message: String(error) };
}

async function readResponseSnippet(response: Response) {
  try {
    const text = await response.clone().text();
    return text.slice(0, 400);
  } catch {
    return '';
  }
}

export async function fetchLivePeruElectionMarketSnapshot({
  fetchImpl = fetch,
  logger = console,
  timeoutMs = 8_000,
  retries = 3,
  retryDelaysMs = [300, 1_000],
}: FetchLivePolymarketOptions = {}): Promise<PolymarketEventSnapshot> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetchImpl(POLYMARKET_EVENT_URL, {
        headers: {
          accept: 'application/json',
          'user-agent': POLYMARKET_USER_AGENT,
        },
        signal: controller.signal,
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok) {
        const bodySnippet = await readResponseSnippet(response);
        throw new Error(`Polymarket respondió ${response.status}. Body: ${bodySnippet || 'sin contenido'}`);
      }

      if (!contentType.includes('application/json')) {
        const bodySnippet = await readResponseSnippet(response);
        throw new Error(`Polymarket devolvió content-type inesperado: ${contentType || 'desconocido'}. Body: ${bodySnippet || 'sin contenido'}`);
      }

      const raw = (await response.json()) as GammaEvent;
      return normalizeGammaEvent(raw);
    } catch (error) {
      lastError = error;
      logger.error?.('[polymarket] Falló el fetch live', {
        url: POLYMARKET_EVENT_URL,
        attempt,
        retries,
        timeoutMs,
        error: serializeError(error),
      });

      if (attempt < retries) {
        await sleep(retryDelaysMs[attempt - 1] ?? retryDelaysMs.at(-1) ?? 0);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Polymarket falló sin detalle adicional.');
}
