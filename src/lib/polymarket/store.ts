import { get, put } from '@vercel/blob';
import { readFile } from 'node:fs/promises';
import { assertValidSnapshot } from './normalize';
import {
  POLYMARKET_BLOB_PATHNAME,
  type PolymarketEventSnapshot,
} from './types';

export interface PolymarketSnapshotStoreOptions {
  token?: string;
  blobGet?: typeof get;
  blobPut?: typeof put;
  seedPath?: URL;
}

const DEFAULT_SEED_PATH = new URL('../../data/polymarket/peru-election-winner.seed.json', import.meta.url);

function resolveBlobToken(token?: string) {
  return token ?? process.env.BLOB_READ_WRITE_TOKEN ?? '';
}

async function readStreamAsText(stream: ReadableStream<Uint8Array>) {
  return await new Response(stream).text();
}

export function parseStoredSnapshot(raw: unknown) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('El snapshot persistido no es un objeto válido.');
  }

  return assertValidSnapshot(raw as PolymarketEventSnapshot);
}

export async function readPersistedSnapshot({
  token,
  blobGet = get,
}: Pick<PolymarketSnapshotStoreOptions, 'token' | 'blobGet'> = {}) {
  const resolvedToken = resolveBlobToken(token);
  if (!resolvedToken) return null;

  const result = await blobGet(POLYMARKET_BLOB_PATHNAME, {
    access: 'private',
    token: resolvedToken,
    useCache: false,
  });

  if (!result || result.statusCode !== 200 || !result.stream) return null;

  const text = await readStreamAsText(result.stream);
  return parseStoredSnapshot(JSON.parse(text));
}

export async function persistSnapshot(
  snapshot: PolymarketEventSnapshot,
  {
    token,
    blobPut = put,
  }: Pick<PolymarketSnapshotStoreOptions, 'token' | 'blobPut'> = {},
) {
  const resolvedToken = resolveBlobToken(token);
  if (!resolvedToken) return false;

  const payload = JSON.stringify(assertValidSnapshot(snapshot));

  await blobPut(POLYMARKET_BLOB_PATHNAME, payload, {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
    token: resolvedToken,
  });

  return true;
}

export async function readSeedSnapshot({ seedPath = DEFAULT_SEED_PATH }: Pick<PolymarketSnapshotStoreOptions, 'seedPath'> = {}) {
  const text = await readFile(seedPath, 'utf8');
  return parseStoredSnapshot(JSON.parse(text));
}
