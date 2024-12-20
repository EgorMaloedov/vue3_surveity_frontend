<template>
  <RouterView/>
  <ModalView>
    <component :is="modalStore.modalComponent" />
  </ModalView>
</template>

<script setup>
import ModalView from "./components/ModalViews/ModalView.vue";
import { useModalStore} from "./stores/modalViewStore.js";
import {useTestsStore} from "./stores/testsStore.js";

const modalStore = useModalStore();

</script>
