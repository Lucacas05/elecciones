#!/bin/bash
# Download party logos from Wikimedia Commons
set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)/public/img/partidos"
mkdir -p "$DIR"

API="https://commons.wikimedia.org/w/api.php"

download_commons() {
    local slug="$1"
    local filename="$2"
    local output="$DIR/$slug.webp"
    
    if [ -f "$output" ]; then
        echo "  [$slug] already exists"
        return 0
    fi
    
    echo "  [$slug] looking up: $filename"
    
    local encoded
    encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$filename'))")
    
    local url
    url=$(curl -sSL "${API}?action=query&titles=File:${encoded}&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json" \
        | python3 -c "
import json,sys
d=json.load(sys.stdin)
pages=d.get('query',{}).get('pages',{})
for pid,p in pages.items():
    ii=p.get('imageinfo',[])
    if ii:
        print(ii[0].get('thumburl',ii[0].get('url','')))
        break
" 2>/dev/null)
    
    if [ -z "$url" ]; then
        echo "  [$slug] FAILED - no URL"
        return 1
    fi
    
    echo "  [$slug] downloading..."
    
    local ext="${url##*.}"
    ext="${ext%%\?*}"
    local temp="$DIR/${slug}_temp.${ext}"
    
    if curl -sSL -o "$temp" "$url"; then
        # Try PIL conversion to webp
        if python3 -c "
from PIL import Image
img = Image.open('$temp')
if img.mode in ('RGBA','LA') or (img.mode=='P' and 'transparency' in img.info):
    img = img.convert('RGBA')
else:
    img = img.convert('RGB')
s = max(img.size)
if s > 400:
    r = 400/s
    img = img.resize((int(img.size[0]*r), int(img.size[1]*r)), Image.LANCZOS)
img.save('$output', 'WEBP', quality=90)
" 2>/dev/null; then
            rm -f "$temp"
            echo "  [$slug] OK (webp)"
        else
            # If no PIL, keep the original format
            local final="$DIR/$slug.$ext"
            mv "$temp" "$final"
            echo "  [$slug] OK ($ext, no webp converter)"
        fi
        return 0
    else
        rm -f "$temp"
        echo "  [$slug] FAILED download"
        return 1
    fi
}

download_direct() {
    local slug="$1"
    local url="$2"
    local output="$DIR/$slug.webp"
    
    if [ -f "$output" ]; then
        echo "  [$slug] already exists"
        return 0
    fi
    
    echo "  [$slug] downloading direct..."
    
    local ext="${url##*.}"
    ext="${ext%%\?*}"
    local temp="$DIR/${slug}_temp.${ext}"
    
    if curl -sSL -o "$temp" "$url"; then
        if python3 -c "
from PIL import Image
img = Image.open('$temp')
if img.mode in ('RGBA','LA') or (img.mode=='P' and 'transparency' in img.info):
    img = img.convert('RGBA')
else:
    img = img.convert('RGB')
s = max(img.size)
if s > 400:
    r = 400/s
    img = img.resize((int(img.size[0]*r), int(img.size[1]*r)), Image.LANCZOS)
img.save('$output', 'WEBP', quality=90)
" 2>/dev/null; then
            rm -f "$temp"
            echo "  [$slug] OK (webp)"
        else
            local final="$DIR/$slug.$ext"
            mv "$temp" "$final"
            echo "  [$slug] OK ($ext)"
        fi
        return 0
    else
        rm -f "$temp"
        echo "  [$slug] FAILED download"
        return 1
    fi
}

echo "=== Downloading party logos ==="

# Wikimedia Commons
download_commons "fuerza-popular" "Logo of the Popular Force (2024).svg"
download_commons "peru-libre" "Perú Libre logo.svg"
download_commons "accion-popular" "Acción Popular.png"
download_commons "renovacion-popular" "Renovación Popular logo.svg"
download_commons "somos-peru" "Logo Partido Democrático Somos Perú.svg"
download_commons "juntos-por-el-peru" "Logo juntos por el Peru.svg"
download_commons "partido-morado" "Partido Morado logo.svg"
download_commons "partido-patriotico-del-peru" "Partido Patriótico del Perú (logo).svg"
download_commons "prin" "Partido Político PRIN - Símbolo.png"
download_commons "pte" "Logo PTE PERU.jpg"
download_commons "peru-primero" "Logo de Perú Primero.jpg"
download_commons "partido-democrata-unido-peru" "Logo de partido democratico unido peru.jpg"
download_commons "avanza-pais" "Avanza País Logo 2017-20.jpg"
download_commons "app" "Alianza para el Progreso Peru.svg"
download_commons "podemos-peru" "Logo Podemos Perú.png"

echo ""
echo "=== Results ==="
echo "Files in partidos/:"
ls -la "$DIR"/ 2>/dev/null || echo "  (empty)"
