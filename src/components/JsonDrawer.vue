<script setup>
import { computed } from 'vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Object, Array, String, Number, Boolean, null],
    default: null,
  },
})

const emit = defineEmits(['update:visible'])

const formatted = computed(() => {
  if (props.value === undefined || props.value === null) {
    return ''
  }

  if (typeof props.value === 'string') {
    return props.value
  }

  return JSON.stringify(props.value, null, 2)
})

async function copyToClipboard() {
  if (!formatted.value) {
    return
  }

  await navigator.clipboard.writeText(formatted.value)
}
</script>

<template>
  <Drawer
    class="json-drawer"
    :visible="visible"
    position="right"
    :header="title"
    style="width: min(36rem, 100vw)"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex justify-end mb-3">
      <Button
        type="button"
        label="Copy"
        icon="pi pi-copy"
        severity="secondary"
        outlined
        :disabled="!formatted"
        @click="copyToClipboard"
      />
    </div>
    <pre>{{ formatted }}</pre>
  </Drawer>
</template>
