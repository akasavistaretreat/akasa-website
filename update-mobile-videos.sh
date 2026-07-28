#!/bin/bash
# AKASA Valley Retreat — true 9:16 mobile films
#
# These are Higgsfield AI *reframes* of the original landscape masters:
# instead of centre-cropping the 16:9 frame (which chopped the sides off),
# the model keeps the full width and generates new content above and below
# to fill a portrait canvas. Masters are 1080x1920 and we keep that height:
# a modern phone is ~1100-1300 device px wide (iPhone 15 Pro = 393 CSS x 3),
# so the earlier 720-wide encode was already being upscaled — and tablets in
# portrait now receive these files too. At 5s they still land around 1-2 MB.
#
# Run from the akasa-website folder:  bash update-mobile-videos.sh
set -e
cd "$(dirname "$0")"

CDN="https://d8j0ntlcm91z4.cloudfront.net/user_3GGs45nWqoS4cgRqBAF4frcR8eA"
RAWDIR="_higgsfield_raw"
OUTDIR="public/videos"
mkdir -p "$RAWDIR" "$OUTDIR"

if ! command -v ffmpeg >/dev/null; then
  echo "ffmpeg not found — install with: brew install ffmpeg"
  exit 1
fi

# name | reframe job file
JOBS=(
  "pool-villa|hf_20260728_140347_dd241399-5050-4edb-95d5-f9e639dd991d.mp4"
  "cottage-glide|hf_20260728_140359_f661961c-0b2b-4865-8129-50401f19c550.mp4"
)

for entry in "${JOBS[@]}"; do
  NAME="${entry%%|*}"
  FILE="${entry##*|}"
  RAW="$RAWDIR/${NAME}-portrait-1080.mp4"
  OUT="$OUTDIR/${NAME}-mobile.mp4"

  if [ ! -f "$RAW" ]; then
    echo "Downloading 9:16 master for $NAME..."
    curl -L --progress-bar -o "$RAW" "$CDN/$FILE"
  fi

  # keep the old centre-crop around in case you want to compare
  if [ -f "$OUT" ] && [ ! -f "${OUT%.mp4}-oldcrop.mp4" ]; then
    cp "$OUT" "${OUT%.mp4}-oldcrop.mp4"
  fi

  echo "Encoding $OUT (1080x1920)..."
  ffmpeg -y -loglevel error -i "$RAW" \
    -vf "scale=1080:-2" -an -c:v libx264 -preset medium \
    -crf 25 -pix_fmt yuv420p -movflags +faststart "$OUT"
  echo "  -> $OUT ($(du -h "$OUT" | cut -f1))"
done

echo
echo "Done. src/components/shared/media.js swaps to *-mobile.mp4 whenever the"
echo "viewport is portrait-ish (w/h < 0.85) — phones AND tablets in portrait —"
echo "and swaps back on rotation, so nothing else needs changing."
echo "Delete *-oldcrop.mp4 once you're happy with the new versions."
