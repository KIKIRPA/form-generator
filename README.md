# Form Generator

This tool facilitates filling in structured metadata using JSON Schema forms.

It implements:

- a catalog of locally stored JSON Schemas
- on-the-fly transformation of a schema into a web form using [JSON Forms](https://jsonforms.io/) and [jsonforms-primevue](https://github.com/kobbejager/jsonforms-primevue)
- read-only inspection of the active schema and form data

All data stays in the browser. Nothing is sent to a server.

The Form Generator is deployed here: https://bytes.kikirpa.be/form-generator

## Development

```bash
yarn install
yarn dev
```

Open http://localhost:5173

## Build

```bash
yarn build
```

The production build is written to `dist/`. Deploy the contents of that folder to the static host under `/form-generator/`.

## URL parameters

### The `schema` parameter

Pre-select a schema from the local catalog:

```
https://bytes.kikirpa.be/form-generator/?schema=3d-scanning
```

Available schema ids are defined in `src/schemas/index.js`.

## Adding schemas

1. Add `your-schema.schema.json` to `src/schemas/`
2. Optionally add `your-schema.uischema.json` for layout and renderer options
3. Register the schema in `src/schemas/index.js`

If no UI schema is provided, one is generated automatically from the JSON Schema.

## Stack

- Vue 3 + Vite
- PrimeVue 4
- JSON Forms
- jsonforms-primevue
