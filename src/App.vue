<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Generate, createAjv } from '@jsonforms/core'
import { JsonForms } from '@jsonforms/vue'
import { primeVueRenderers } from '@kobbejager/jsonforms-primevue'

import Button from 'primevue/button'
import Card from 'primevue/card'

import JsonDrawer from '@/components/JsonDrawer.vue'
import SchemaSelect from '@/components/SchemaSelect.vue'
import { catalog, findCatalogEntry, loadCatalogEntry } from '@/schemas'

const renderers = Object.freeze([...primeVueRenderers])
const ajv = createAjv()
ajv.addFormat('textarea', true)
ajv.addFormat('grid', true)
const assetBase = import.meta.env.BASE_URL

const selectedId = ref(null)
const schema = ref(null)
const uischema = ref(null)
const data = ref({})
const loading = ref(false)
const formError = ref('')
const schemaDrawerVisible = ref(false)
const dataDrawerVisible = ref(false)

const selectOptions = computed(() =>
  catalog.map(({ id, label }) => ({ id, label }))
)

const formTitle = computed(() => schema.value?.title ?? 'JSON Schema Form Generator')

function getSchemaIdFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const schemaId = params.get('schema')
  return schemaId && findCatalogEntry(schemaId) ? schemaId : null
}

function updateUrl(schemaId) {
  const url = new URL(window.location.href)

  if (schemaId) {
    url.searchParams.set('schema', schemaId)
  } else {
    url.searchParams.delete('schema')
  }

  window.history.replaceState({}, '', url)
}

async function loadSchema(schemaId) {
  const entry = findCatalogEntry(schemaId)
  if (!entry) {
    schema.value = null
    uischema.value = null
    data.value = {}
    return
  }

  loading.value = true
  formError.value = ''

  try {
    const loaded = await loadCatalogEntry(entry)
    schema.value = loaded.schema
    uischema.value = loaded.uischema ?? Generate.uiSchema(loaded.schema)
    data.value = {}
  } catch (error) {
    schema.value = null
    uischema.value = null
    data.value = {}
    formError.value = error.message ?? 'Failed to load schema'
  } finally {
    loading.value = false
  }
}

function onFormChange(event) {
  data.value = event.data
}

function downloadData() {
  const text = JSON.stringify(data.value, null, 2)
  const filename = `${data.value?.id ?? data.value?.title ?? selectedId.value ?? Date.now()}.json`
  const element = document.createElement('a')
  element.href = `data:application/json;charset=utf-8,${encodeURIComponent(text)}`
  element.download = filename
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

watch(selectedId, async (schemaId) => {
  updateUrl(schemaId)
  await loadSchema(schemaId)
})

onMounted(() => {
  const initialId = getSchemaIdFromUrl() ?? catalog[0]?.id ?? null
  selectedId.value = initialId
})
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <Button
        as="a"
        href="/"
        label="Other Bits of Bytes"
        icon="pi pi-chevron-left"
        text
        class="app-header-link"
      />
      <h1 class="app-header-title">JSON Schema Form Generator</h1>
      <Button
        as="a"
        href="https://github.com/KIKIRPA/form-generator"
        target="_blank"
        rel="noopener noreferrer"
        label="Code on GitHub"
        icon="pi pi-github"
        text
        class="app-header-link"
      />
    </header>

    <main class="app-main">
      <Card>
        <template #content>
          <div class="mb-4">
            <SchemaSelect v-model="selectedId" :options="selectOptions" />
          </div>

          <div class="form-toolbar">
            <Button
              type="button"
              label="Schema"
              icon="pi pi-code"
              severity="secondary"
              outlined
              :disabled="!schema"
              @click="schemaDrawerVisible = true"
            />
            <Button
              type="button"
              label="Data"
              icon="pi pi-database"
              severity="secondary"
              outlined
              :disabled="!schema"
              @click="dataDrawerVisible = true"
            />
            <Button
              type="button"
              label="Download"
              icon="pi pi-download"
              :disabled="!schema"
              @click="downloadData"
            />
          </div>
        </template>
      </Card>

      <Card>
        <template #title>{{ formTitle }}</template>
        <template #content>
          <div v-if="loading" class="text-sm text-surface-500">
            Loading schema…
          </div>

          <p v-else-if="formError" class="text-sm text-red-600">
            {{ formError }}
          </p>

          <json-forms
            v-else-if="schema"
            :key="selectedId"
            :schema="schema"
            :uischema="uischema"
            :data="data"
            :renderers="renderers"
            :ajv="ajv"
            @change="onFormChange"
          />

          <p v-else class="text-sm text-surface-500">
            Choose a schema from the list above to render a form.
          </p>
        </template>
      </Card>
    </main>

    <footer class="app-footer">
      <div class="footer-grid">
        <div>
          <div class="footer-logo">
            <a href="https://www.kikirpa.be">
              <img :src="`${assetBase}img/kikirpa-logo.png`" alt="KIKIRPA" />
            </a>
          </div>
          <p>
            Developed by Wim Fremout for the Royal Institute for Cultural Heritage
          </p>
          <p>
            The
            <a href="https://github.com/KIKIRPA/form-generator">source code of JSON Schema Form Generator</a>
            is available on GitHub as open source under the
            <a href="https://github.com/KIKIRPA/form-generator/blob/master/LICENSE">MIT license</a>.
          </p>
        </div>

        <div>
          <p class="text-center italic mb-2">
            This tool was developed and tested as part of the work of the following projects:
          </p>
          <div class="project-logos">
            <div class="project-block text-center">
              <a href="http://hescida.kikirpa.be/" rel="nofollow">
                <img :src="`${assetBase}img/hescida-logo.png`" alt="HESCIDA" />
              </a>
              <div class="funding-row">
                <img :src="`${assetBase}img/belspo-logo.png`" alt="Belspo" />
                <img :src="`${assetBase}img/be-logo.png`" alt="Belgium" />
                <span>
                  HESCIDA is a project funded by the Belgian Science Policy PPS<br />
                  Grant number FSIRI/00/HE1
                </span>
              </div>
            </div>
            <div class="project-block text-center">
              <a href="https://www.iperionhs.eu/" rel="nofollow">
                <img :src="`${assetBase}img/iphs-logo.png`" alt="IPERION-HS" />
              </a>
              <div class="funding-row">
                <img :src="`${assetBase}img/eu-logo.png`" alt="European Union" />
                <span>
                  IPERION HS is a project funded by the European Union<br />
                  H2020-INFRAIA-2019-1, under GA 871034
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <JsonDrawer
      v-model:visible="schemaDrawerVisible"
      title="JSON Schema"
      :value="schema"
    />

    <JsonDrawer
      v-model:visible="dataDrawerVisible"
      title="Form data"
      :value="data"
    />
  </div>
</template>
