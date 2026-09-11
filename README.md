# Faces

Faces is a local-first facial-vocabulary trainer. It isolates one structural
feature at a time, tests retrieval with a session-scaled Leitner deck, and turns
the same vocabulary into a top-to-bottom field card.

## What it includes

- **Field card** — choose one term for each of 11 structural surfaces and copy a
  concise description.
- **Drill** — study randomized two-view exemplars, hide the label, and answer a
  four-choice probe.
- **Structural atlas** — browse all 62 terms by facial surface.
- **Appearance reference** — optionally record the nearest Monk Skin Tone (MST)
  swatch without treating tone as anatomy, race, or sun-response type.
- **Session metrics** — inspect descriptive recall, viewing time, and answer
  latency. These are learning aids, not a validated assessment.

Progress stays in the browser. There are no accounts, analytics, database
writes, or network requests for learner data.

## Development

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

The app builder preview contract uses port 8080. The production build targets
Vercel through the existing TanStack Start/Nitro configuration.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run check` runs all four gates. The unit suite covers catalog integrity,
feature isolation, retrieval choices, Leitner scheduling, MST data, and saved
state migration in addition to the app-builder template contracts.

## Saved-state compatibility

The current schema is version 2 under `faces-trainer`. On first load it falls
back to the retired `lineament-trainer` key, migrates either legacy `cards` or
newer `deck` progress, maps the old structural skin entry to
`appearance.skinToneId`, removes retired skin cards, and keeps the last 400
valid trials.

## Monk Skin Tone attribution

This project reproduces the ten official colour swatches from:

> Monk, Ellis. “Monk Skin Tone Scale,” 2019. <https://skintone.google>

The Monk Skin Tone Scale is licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). A swatch is a close
visual reference only: skin appearance changes with lighting, cameras, screens,
and the sampled area. The scale should not be used as a proxy for race or for
Fitzpatrick phototype.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the attribution record.

## License

Project code is available under the [MIT License](LICENSE). Third-party content
retains its own license.
