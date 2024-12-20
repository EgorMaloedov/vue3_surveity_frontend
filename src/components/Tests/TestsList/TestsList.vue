<template>
  <div class="tests-list">
    <TestsListItem
        v-for="test in testsArray"
        :key="test.id"
        :test="test"
    />
  </div>
</template>

<script setup>
import {useTestsStore} from "../../../stores/testsStore.js";
import TestsListItem from "./TestsListItem.vue";
import {computed} from "vue";

const testsStore = useTestsStore();
const testsArray = computed(()=> Array.from(testsStore.tests.values()));
</script>

<style scoped>
.tests-list {
  gap: 2rem;
  display: flex;
  flex-direction: column;
}
</style>
