<template>
  <div class="step-group">
    <ListItem :title="'Введите название ' + (test.type === 'test' ? 'теста' : 'опроса')">
      <TextInput
          v-model="test.title"
          id="test-title"
          autocomplete="test-name"
          :placeholder="'Название ' + (test.type === 'test' ? 'теста' : 'опроса')"
          type="text"
      />
    </ListItem>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ListItem from "../elements/ListItem.vue";
import TextInput from "../elements/TextInput.vue";

const props = defineProps({
  test: Object
});
</script>
