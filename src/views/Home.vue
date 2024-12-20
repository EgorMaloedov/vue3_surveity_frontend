<template>
  <PageLayout>
    <TestsControlPanel/>
    <EmptyTestsList v-if="testsSize === 0 && !testsStore.isLoading" />
    <TestsList v-else/>
  </PageLayout>
</template>

<script setup>
import PageLayout from "../layouts/PageLayout.vue";
import TestsControlPanel from "../components/Tests/TestsControlPanel.vue";
import TestStoreLoader from "../components/Tests/TestStoreLoader.vue";
import EmptyTestsList from "../components/Tests/TestsList/EmptyTestsList.vue";
import TestsList from "../components/Tests/TestsList/TestsList.vue";
import {computed, onMounted} from "vue";
import {useTestsStore} from "../stores/testsStore.js";
const testsStore = useTestsStore()

const testsSize = computed(()=> {
  const tests = testsStore.tests
  return tests.size
})

onMounted(async ()=>{
  await testsStore.fetchUserTests()
})

</script>
