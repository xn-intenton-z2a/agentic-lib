# Mission

A JavaScript library that manages a simple OWL-like ontology stored as JSON-LD files in a `data/` directory at the project root.

## Core Functions

- `defineClass(name, superclass?)` — define an ontology class, optionally as a subclass.
- `defineProperty(name, domain, range, opts?)` — define a property linking two classes.
- `addIndividual(className, id, properties)` — add an instance of a class with property values.
- `query(pattern)` — query the ontology. Supported patterns:
  - `{ class: "ClassName" }` — return all individuals of that class (including subclasses).
  - `{ property: "propName", value: "val" }` — return all individuals with that property value.
- `load(dir?)` — load ontology from JSON-LD files in `data/` (default). Returns the loaded ontology object.
- `save(dir?)` — persist the ontology as one JSON-LD file per class in `data/` (default).
- `stats()` — return `{ classes, properties, individuals }` counts.

## JSON-LD Format

- Use namespace `http://example.org/ontology#` as the `@context` vocabulary.
- Store one file per class in `data/`, named `<ClassName>.jsonld` (e.g. `data/Mammal.jsonld`).
- Each file contains the class definition and its individuals as a JSON-LD graph.

## Seed Ontology

The library must include a seed ontology demonstrating all features:

- Classes: `Animal` > `Mammal` > `Dog`, `Cat`; `Animal` > `Bird` > `Parrot`
- Properties: `hasName` (string), `hasLegs` (integer)
- Individuals: at least 3 (e.g. `Dog/rex` with hasName "Rex" and hasLegs 4, `Cat/whiskers`, `Parrot/polly` with hasLegs 2)

## Requirements

- Export all functions as named exports from `src/lib/main.js`.
- No external runtime dependencies.
- Comprehensive unit tests covering CRUD operations, querying (both patterns), persistence round-trip, and stats.
- README with usage examples.

## Acceptance Criteria

- [ ] Can define classes with inheritance (superclass)
- [ ] Can define properties with domain and range
- [ ] Can add individuals and query by class (returns subclass instances too)
- [ ] Can query by property value
- [ ] Data persists to `data/` as JSON-LD files and loads back correctly (round-trip)
- [ ] Seed ontology with animals is populated in `data/`
- [ ] `stats()` returns correct counts
- [ ] All unit tests pass
- [ ] README documents the API with examples
