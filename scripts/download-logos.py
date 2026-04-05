#!/usr/bin/env python3
"""Download party logos from Wikimedia Commons."""

import json
import os
import ssl
import urllib.request
import urllib.parse

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'img', 'partidos')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

COMMONS_FILES = {
    'fuerza-popular': 'Logo of the Popular Force (2024).svg',
    'peru-libre': 'Perú Libre logo.svg',
    'accion-popular': 'Acción Popular.png',
    'renovacion-popular': 'Renovación Popular logo.svg',
    'somos-peru': 'Logo Partido Democrático Somos Perú.svg',
    'juntos-por-el-peru': 'Logo juntos por el Peru.svg',
    'partido-morado': 'Partido Morado logo.svg',
    'partido-patriotico-del-peru': 'Partido Patriótico del Perú (logo).svg',
    'prin': 'Partido Político PRIN - Símbolo.png',
    'pte': 'Logo PTE PERU.jpg',
    'peru-primero': 'Logo de Perú Primero.jpg',
    'partido-democrata-unido-peru': 'Logo de partido democratico unido peru.jpg',
    'avanza-pais': 'Avanza País Logo 2017-20.jpg',
    'app': 'Alianza para el Progreso Peru.svg',
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


def to_webp(src, dst):
    try:
        from PIL import Image
        img = Image.open(src)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
        s = max(img.size)
        if s > 400:
            r = 400 / s
            img = img.resize((int(img.size[0] * r), int(img.size[1] * r)), Image.LANCZOS)
        img.save(dst, 'WEBP', quality=90)
        return True
    except Exception as e:
        print(f'    PIL error: {e}')
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    ok = 0
    fail = 0

    for slug, filename in COMMONS_FILES.items():
        webp = os.path.join(OUTPUT_DIR, f'{slug}.webp')
        if os.path.exists(webp):
            print(f'  [{slug}] exists')
            ok += 1
            continue

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
        if ext not in ('png', 'jpg', 'jpeg', 'svg', 'webp'):
            ext = 'png'
        temp = os.path.join(OUTPUT_DIR, f'{slug}_temp.{ext}')

        try:
            download(thumb, temp)
        except Exception as e:
            print(f'  [{slug}] download error: {e}')
            fail += 1
            continue

        if to_webp(temp, webp):
            os.remove(temp)
            print(f'  [{slug}] OK (webp)')
            ok += 1
        else:
            final = os.path.join(OUTPUT_DIR, f'{slug}.{ext}')
            os.rename(temp, final)
            print(f'  [{slug}] OK ({ext})')
            ok += 1

    print(f'\nDownloaded: {ok}  Failed: {fail}')
    print('Files:')
    for f in sorted(os.listdir(OUTPUT_DIR)):
        if not f.startswith('.'):
            print(f'  {f}')


if __name__ == '__main__':
    main()
