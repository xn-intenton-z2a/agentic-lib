# Mission

A JavaScript library and CLI that renders emotion as ASCII art faces. Supports a fixed set of emotions, each with a distinct facial expression.

## Core Functions

- `renderFace(emotion)` — return a multi-line string depicting the given emotion as ASCII art. Throws `TypeError` if the emotion is not recognised.
- `listEmotions()` — return an array of supported emotion names.

## Supported Emotions

The library must support exactly these 6 emotions: `happy`, `sad`, `angry`, `surprised`, `neutral`, `confused`.

Each face must be:
- At least 5 lines tall and 9 characters wide
- Visually distinct from all other faces (different mouth, eyebrow, or eye patterns)
- Composed only of printable ASCII characters (no Unicode)

## CLI

When run as `node src/lib/main.js --emotion <name>`, print the face to stdout and exit with code 0. When run with `--list`, print all supported emotion names one per line. Print an error message and exit with code 1 for unrecognised emotions.

## Requirements

- Export all functions as named exports from `src/lib/main.js`.
- No external runtime dependencies.
- Comprehensive unit tests verifying each emotion produces distinct output of the required dimensions.
- README with examples showing each face.

## Acceptance Criteria

- [ ] `listEmotions()` returns `["happy", "sad", "angry", "surprised", "neutral", "confused"]`
- [ ] `renderFace("happy")` returns a string of at least 5 lines and 9 characters wide
- [ ] Each of the 6 emotions produces visually distinct output (no two are identical)
- [ ] `renderFace("unknown")` throws `TypeError`
- [ ] CLI `--emotion happy` prints a face to stdout
- [ ] CLI `--list` prints all 6 emotion names
- [ ] All unit tests pass
- [ ] README shows all 6 faces
