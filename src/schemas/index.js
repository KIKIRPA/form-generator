export const catalog = [
  {
    id: '3d-scanning',
    label: '3D scanning',
    schema: () => import('./3DScanning.schema.json'),
  },
]

export function findCatalogEntry(id) {
  return catalog.find((entry) => entry.id === id) ?? null
}

function prepareSchema(schema) {
  if (!schema || typeof schema !== 'object') {
    return schema
  }

  const prepared = { ...schema }
  // JSON Forms uses AJV draft-07. A $schema of draft 2019-09/2020-12 throws
  // "no schema with key or ref ..." and the form never mounts.
  if (
    typeof prepared.$schema === 'string' &&
    !prepared.$schema.includes('draft-07')
  ) {
    delete prepared.$schema
  }

  return prepared
}

export async function loadCatalogEntry(entry) {
  const schemaModule = await entry.schema()
  const schema = prepareSchema(schemaModule.default ?? schemaModule)

  let uischema = undefined
  if (entry.uischema) {
    const uischemaModule = await entry.uischema()
    uischema = uischemaModule.default ?? uischemaModule
  }

  return { schema, uischema }
}
