import { defineStore } from 'pinia';
import {markRaw} from "vue";
export const useModalStore = defineStore('modalStore', {


    state: () => ({
        isModalOpened: false,
        modalComponent: null,
        modalType: null,
        modalTitle: null,
        modalDescription: null
    }),
    actions: {
        openModal(component, modalType = null, modalTitle = null, modalDescription = null) {
            this.isModalOpened = true;
            this.modalComponent = markRaw(component);
            this.modalType = modalType? modalType : 'default';
            this.modalTitle = modalTitle;
            this.modalDescription = modalDescription;
        },
        closeModal(callback = ()=>{}, args) {
            this.isModalOpened = false;
            this.modalComponent = null;
            callback(args);
        },
    },
});
