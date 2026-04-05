#!/usr/bin/env python3
"""Download remaining party logos with delays to avoid rate limiting."""

import json
import os
import ssl
import time
import urllib.request
import urllib.parse

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'img', 'partidos')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

COMMONS_FILES = {
    'juntos-por-el-peru': 'Logo juntos por el Peru.svg',
    'partido-patriotico-del-peru': 'Partido Patriótico del Perú (logo).svg',
    'prin': 'Partido Político PRIN - Símbolo.png',
    'pte': 'Logo PTE PERU.jpg',
    'peru-primero': 'Logo de Perú Primero.jpg',
    'partido-democrata-unido-peru': 'Logo de partido democratico unido peru.jpg',
    'avanza-pais': 'Avanza País Logo 2017-20.jpg',
    'podemos-peru': 'Podemos Peru Logo.png',
    'frente-de-la-esperanza': 'Frente de la Esperanza 2021 (logo).svg',
    'fe-en-el-peru': 'Fe en el Perú (logo).svg',
    'cooperacion-popular': 'Cooperación Popular (logo).svg',
    'obras': 'Obras logo Peru.png',
    'salvemos-al-peru': 'Salvemos al Perú logo.png',
    'peru-accion': 'Perú Acción logo.svg',
    'libertad-popular': 'Libertad Popular (logo).svg',
    'peru-moderno': 'Perú Moderno logo.svg',
    'primero-la-gente': 'Primero la Gente logo.svg',
    'progresemos': 'Progresemos (logo).svg',
    'ahora-nacion': 'Ahora Nación logo.svg',
    'pbg': 'Partido del Buen Gobierno logo.svg',
    'venceremos': 'Venceremos Peru logo.svg',
    'integridad-democratica': 'Integridad Democrática logo.svg',
    'partido-democratico-federal': 'Partido Democrático Federal logo.svg',
    'si-creo': 'Sí Creo logo.svg',
    'pais-para-todos': 'País para Todos logo.svg',
    'un-camino-diferente': 'Un Camino Diferente logo.svg',
    'unidad-nacional': 'Unidad Nacional logo.svg',
    'fuerza-y-libertad': 'Fuerza y Libertad logo.svg',
}

THUMB_SIZE = 400


def api_get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'DecidePeru/1.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
        return json.loads(resp.read().decode())


def get_thumb_url(filename):
    encoded = urllib.parse.quote(filename)
    url = (f'https://commons.wikimedia.org/w/api.php?action=query'
           f'&titles=File:{encoded}&prop=imageinfo&iiprop=url'
           f'&iiurlwidth={THUMB_SIZE}&format=json')
    data = api_get(url)
    pages = data.get('query', {}).get('pages', {})
    for pid, p in pages.items():
        if int(pid) < 0:
            return None
        ii = p.get('imageinfo', [])
        if ii:
            return ii[0].get('thumburl', ii[0].get('url'))
    return None


def download(url, path):
    req = urllib.request.Request(url, headers={'User-Agent': 'DecidePeru/1.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
        data = resp.read()
    with open(path, 'wb') as f:
        f.write(data)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    ok = 0
    fail = 0

    for slug, filename in COMMONS_FILES.items():
        # Check for any existing format
        exists = False
        for ext in ('webp', 'png', 'jpg', 'jpeg'):
            if os.path.exists(os.path.join(OUTPUT_DIR, f'{slug}.{ext}')):
                exists = True
                break
        if exists:
            print(f'  [{slug}] exists')
            ok += 1
            continue

        time.sleep(2)
        print(f'  [{slug}] looking up: {filename}')
        try:
            thumb = get_thumb_url(filename)
        except Exception as e:
            print(f'  [{slug}] API error: {e}')
            fail += 1
            continue

        if not thumb:
            print(f'  [{slug}] not found on Commons')
            fail += 1
            continue

        ext = thumb.rsplit('.', 1)[-1].split('?')[0].lower()
        if ext not in ('png', 'jpg', 'jpeg'):
            ext = 'png'
        out = os.path.join(OUTPUT_DIR, f'{slug}.{ext}')

        time.sleep(1)
        try:
            download(thumb, out)
            print(f'  [{slug}] OK ({ext})')
            ok += 1
        except Exception as e:
            print(f'  [{slug}] download error: {e}')
            fail += 1

    print(f'\nDownloaded: {ok}  Failed: {fail}')
    print('Files:')
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if not f.startswith('.'):
            print(f'  {f}')


if __name__ == '__main__':
    main()
