<template>
  <div class="step-group">
    <ListItem title="Выберите тип опроса:">
      <SelectInput v-model="test.type" :options="selectOptions" label="Тип опроса" />
    </ListItem>

    <ListItem :title="'Введите название ' + (test.type === 'test' ? 'теста' : 'опроса')">
      <TextInput
          v-model="test.title"
          id="test-title"
          :placeholder="'Название ' + (test.type === 'test' ? 'теста' : 'опроса')"
          type="text"
      />
    </ListItem>

    <ListItem title="Выберите даты:">
      <div class="date-picker-row">
        <DatePickerInput
            v-model="test.start_date"
            :min-date="new Date()"
            label="Дата начала"
        />
        <DatePickerInput
            v-model="test.end_date"
            :min-date="calculateMinEndDate(test.start_date)"
            label="Дата окончания"
        />
      </div>
    </ListItem>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import ListItem from "../elements/ListItem.vue";
import TextInput from "../elements/TextInput.vue";
import DatePickerInput from "../elements/DatePickerInput.vue";
import SelectInput from "../elements/SelectInput.vue";
import { selectOptions, calculateMinEndDate } from "../constants.js";

const props = defineProps({
  test: Object
});
</script>

<style scoped>
.date-picker-row {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
}

.date-picker-row > * {
  flex: 1;
}
</style>
