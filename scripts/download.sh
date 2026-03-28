#!/bin/bash
# Download MLIT 国土数値情報 N02 Railway Data (2024 edition)
# Source: https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-2024.html
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
RAW_DIR="$ROOT_DIR/raw"
ZIP_FILE="$RAW_DIR/N02-24_GML.zip"
URL="https://nlftp.mlit.go.jp/ksj/gml/data/N02/N02-24/N02-24_GML.zip"

mkdir -p "$RAW_DIR"

if [ -f "$RAW_DIR/UTF-8/N02-24_Station.geojson" ]; then
  echo "MLIT data already exists, skipping download."
  exit 0
fi

echo "Downloading MLIT N02-24 railway data..."
curl -L -o "$ZIP_FILE" "$URL"

echo "Extracting UTF-8 GeoJSON files..."
unzip -o "$ZIP_FILE" "UTF-8/*" -d "$RAW_DIR"

rm -f "$ZIP_FILE"
echo "Done. Files extracted to $RAW_DIR/UTF-8/"
