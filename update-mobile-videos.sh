#!/bin/bash
# AKASA Valley Retreat — portrait (9:16) mobile cuts
#
# These are centre crops taken straight from the 3852x2152 Higgsfield masters,
# then downscaled to 1080x1920. Every pixel is real rendered footage.
#
# We tried AI reframing instead (Higgsfield's reframe model, job IDs below) and
# backed it out. Going 16:9 -> 9:16 while keeping the full width means the model
# has to invent roughly 68% of the frame — only a narrow middle band is source
# footage. In practice that produced a flat grey generated sky, paving stones
# that shifted shape between frames, and a colour grade that turned the warm
# dusk shots into overcast afternoons. Cropping loses the wide establishing
# framing but keeps the mood, the sharpness and the stability.
#   pool-villa reframe:    dd241399-5050-4edb-95d5-f9e639dd991d
#   cottage-glide reframe: f661961c-0b2b-4865-8129-50401f19c550
#
# Crop maths: 9:16 of a 2152px-tall frame is 1210px wide, centred at x=1321.
# Downscaling 1210 -> 1080 keeps it sharp; nothing is upscaled.
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

# name | 4K master on the CDN
JOBS=(
  "pool-villa|hf_20260709_164648_e0403d92-6e0a-4f66-8a61-103ded805ff4.mp4"
  "cottage-glide|hf_20260709_164651_f70271b8-4474-47dc-9fc6-a34ea4ceca46.mp4"
)

for entry in "${JOBS[@]}"; do
  NAME="${entry%%|*}"
  FILE="${entry##*|}"
  RAW="$RAWDIR/${NAME}-4k.mp4"
  OUT="$OUTDIR/${NAME}-mobile.mp4"

  if [ ! -f "$RAW" ]; then
    echo "Downloading 4K master for $NAME..."
    curl -L --progress-bar -o "$RAW" "$CDN/$FILE"
  fi

  echo "Cropping $OUT (1080x1920, centre 9:16)..."
  ffmpeg -y -loglevel error -i "$RAW" \
    -vf "crop=1210:2152:1321:0,scale=1080:1920" -an -c:v libx264 -preset medium \
    -crf 25 -pix_fmt yuv420p -movflags +faststart "$OUT"
  echo "  -> $OUT ($(du -h "$OUT" | cut -f1))"
done

# masterplan-reveal is the odd one out: it sits in a fixed aspect-[4/3] frame
# in FutureVision, so it needs no crop at all — the 2880x2160 master is already
# exactly 4:3. Straight downscale from the 4K, which is both sharper than the
# old encode (that one came off a 1664px upscale) and far lighter.
MP_RAW="$RAWDIR/masterplan-reveal-4k.mp4"
MP_OUT="$OUTDIR/masterplan-reveal-mobile.mp4"
if [ ! -f "$MP_RAW" ]; then
  echo "Downloading 4K master for masterplan-reveal..."
  curl -L --progress-bar -o "$MP_RAW" \
    "$CDN/hf_20260711_022301_7560df9c-c660-4e92-b5b6-281a2247dfe3.mp4"
fi
echo "Encoding $MP_OUT (1080x810, native 4:3)..."
ffmpeg -y -loglevel error -i "$MP_RAW" \
  -vf "scale=1080:810" -an -c:v libx264 -preset medium \
  -crf 25 -pix_fmt yuv420p -movflags +faststart "$MP_OUT"
echo "  -> $MP_OUT ($(du -h "$MP_OUT" | cut -f1))"

echo
echo "Done. src/components/shared/media.js swaps to *-mobile.mp4 whenever the"
echo "viewport is portrait-ish (w/h < 0.85) — phones AND tablets in portrait —"
echo "and swaps back on rotation, so nothing else needs changing."
