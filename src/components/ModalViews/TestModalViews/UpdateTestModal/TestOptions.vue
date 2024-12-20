<template>
  <div class="step-group">
    <ListItem :title="'Укажите параметры ' + (test.type === 'test' ? 'теста' : 'опроса')">
      <CheckboxGroup
          v-model="test.options"
          :options="test.type === 'test' ? testCheckboxOptions : surveyCheckboxOptions"
      />
    </ListItem>

    <ListItem
        v-if="test.options['password']"
        :title="'Укажите пароль ' + (test.type === 'test' ? 'теста' : 'опроса')"
    >
      <TextInput
          autocomplete="test-password"
          type="password"
          v-model="test.password"
          id="test-password"
          :placeholder="'Пароль'"
      />
    </ListItem>

    <ListItem
        v-if="test.options['description']"
        :title="'Введите описание ' + (test.type === 'test' ? 'теста' : 'опроса')"
    >
      <TextInput
          autocomplete="test-description"
          type="textarea"
          v-model="test.description"
          id="test-description"
          :placeholder="'Описание'"
      />
    </ListItem>

    <ListItem
        v-if="!test.options['user_inputs']"
        :title="'Выберите поля ввода ' + (test.type === 'test' ? 'теста' : 'опроса')"
    >
      <UserInputs :inputFields="test.user_inputs" @updateFields="updateInputFields"/>
    </ListItem>

    <ListItem
        v-if="test.options['complete_time']"
        title="Выберите ограничение времени на прохождение теста"
    >
      <TimePicker v-model="test.complete_time" />
    </ListItem>
  </div>
</template>

<script setup>
import {defineProps, watch} from 'vue';
import ListItem from "../elements/ListItem.vue";
import TextInput from "../elements/TextInput.vue";
import CheckboxGroup from "../elements/CheckboxGroup.vue";
import UserInputs from "../elements/UserInputs.vue";
import TimePicker from "../elements/TimePicker.vue";
import {testCheckboxOptions, surveyCheckboxOptions} from "../constants.js";

const props = defineProps({
  test: Object
});

watch(() => props.test.options, (newOptions) => {
  if (newOptions['password'] === false) {
    props.test.password = '';
  }

  if (newOptions['description'] === false) {
    props.test.description = '';
  }

  if (newOptions['user_inputs'] === false) {
    props.test.user_inputs = {};
  }

  if (newOptions['complete_time'] === false) {
    props.test.complete_time = {
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  }

}, {deep: true});

const updateInputFields = (fields) => {
  props.test.user_inputs = fields;
};
</script>
