# Montaje del video 1 (piloto v0, 13-nov-2026)

- `overlays.py`: genera los PNG del nombre en dorado (Pinyon Script), la letra "a mano" de la carta (Caveat) y el título final (Great Vibes). Fuentes OFL vía @fontsource.
- `build.py`: corta los clips de Flow, mezcla la voz (Fish "Santa Jinglo") con el ambiente de chimenea de los propios clips (18 %), aplica overlays y renderiza 10 segmentos; luego se concatenan con fundido y loudnorm −16 LUFS.
- v0 **sin lipsync**: las frases a cámara (T4, T7) van detrás del libro (V1-06, dos tomas; la segunda en cámara lenta ×1,72 mientras el libro tapa la boca). Pendiente v1 con Sync Lipsync 2 Pro sobre V1-04 y V1-07.
- Tomas elegidas: V1-01 652f3d0f · V1-02 920d4361 · V1-03 ae0a218f · V1-04 4f3dc75f · V1-06 fe4aeb22 / 020ee288 · V1-05 371713da · V1-08 625e8c87 · V1-09 9bf6ba58.
