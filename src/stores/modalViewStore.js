import { defineStore } from 'pinia';
import {markRaw} from "vue";
export const useModalStore = defineStore('modalStore', {


    state: () => ({
        isModalOpened: false,
        modalComponent: null,
        modalType: null,
        modalTitle: null,
        modalDescription: null,
        disableCloseOnOverlay: false
    }),
    actions: {
        openModal(component, modalType = null, modalTitle = null, modalDescription = null, disableCloseOnOverlay = false) {
            this.isModalOpened = true;
            this.modalComponent = markRaw(component);
            this.modalType = modalType? modalType : 'default';
            this.modalTitle = modalTitle;
            this.modalDescription = modalDescription;
            this.disableCloseOnOverlay = disableCloseOnOverlay;
        },
        closeModal(callback = ()=>{}, args) {
            this.disableCloseOnOverlay = false;
            this.isModalOpened = false;
            this.modalComponent = null;
            callback(args);
        },
    },
});
