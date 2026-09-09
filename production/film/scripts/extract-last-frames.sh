#!/bin/sh
# Writes public/captures/<name>-last.jpg (the final frame of each product recording) so the composition can hold
# a recording's end state when a shot outlasts the clip. Re-run after Codex re-records.
cd "$(dirname "$0")/.." || exit 1
for n in home plan size pip macd patterns room mac; do
  f="public/captures/$n.mp4"; [ -f "$f" ] || continue
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  ffmpeg -v error -y -sseof -0.05 -i "$f" -frames:v 1 -q:v 2 "public/captures/$n-last.jpg"
  echo "$n $d -> public/captures/$n-last.jpg"
done
