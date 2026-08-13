#!/usr/bin/env bash
set -e
base="https://raw.githubusercontent.com/BrandsofBabel/virtuous-commerce-next/main"
mkdir -p public/packs
for f in a b c d e f g h i j k y y2 y3 y4; do
  [ -f "public/packs/$f.webp" ] || curl -fsSL "$base/public/packs/$f.webp" -o "public/packs/$f.webp"
done
[ -f app/favicon.ico ] || curl -fsSL "$base/app/favicon.ico" -o app/favicon.ico
[ -f app/apple-icon.png ] || curl -fsSL "$base/app/apple-icon.png" -o app/apple-icon.png
