<script setup>
import Select from 'primevue/select'

defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  options: {
    type: Array,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <Select
    :model-value="modelValue"
    :options="options"
    option-label="label"
    option-value="id"
    placeholder="Select a JSON schema"
    filter
    show-clear
    fluid
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
