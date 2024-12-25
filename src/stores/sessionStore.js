import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from "../api/client.js";
import response from "vuedraggable";

export const useSessionStore = defineStore('sessionStore', () => {
    const sessionId = ref(null);
    const currentQuestion = ref(null);
    const answers = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const session = ref(null);

    const startTest = async (token, userInputs) => {
        loading.value = true;
        error.value = null;
        try {
            const sessionId = await apiClient.post('/sessions', { userInputs }, { headers: { 'Authorization': `Bearer ${token}` } });
            const response = await apiClient.post(`/sessions/${sessionId.data.session_id[0]}/start`, {}, {headers: { 'Authorization': `Bearer ${token}`}});

            sessionId.value = sessionId.data.session_id[0];

            localStorage.setItem('sessionId', sessionId.value);
            currentQuestion.value = response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'An error occurred';
        } finally {
            loading.value = false;
        }
    };

    const continueTest = async (token) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.post(`/sessions/${sessionId.value}/continue`, {}, {
                headers: { 'Authorization': `Bearer ${token}`}
            });
            currentQuestion.value = response.data.session;
        } catch (err) {
            error.value = err.response?.data?.message || 'An error occurred';
        } finally {
            loading.value = false;
        }
    };

    const getNextQuestion = async (token) => {
        if (!sessionId.value) return;
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get(`/sessions/${sessionId.value}/next`, {
                headers: { 'Authorization': `Bearer ${token}`}
            });
            if (response.data) {
                currentQuestion.value = response.data;
            } else {
                await completeTest();
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'An error occurred';
        } finally {
            loading.value = false;
        }
    };

    const submitAnswer = async (questionId, answerId, token) => {
        sessionId.value = localStorage.getItem('sessionId');
        loading.value = true;
        error.value = null;
        try {
            await apiClient.post(`/sessions/${sessionId.value}/submit_answer`, {
                question_id: questionId,
                answer_id: answerId,
            },
                {
                    headers: { 'Authorization': `Bearer ${token}`}
                }
            );
            if (!currentQuestion.value.isLast){
                await getNextQuestion(token);
            }
            else{
                await completeTest(token);
            }
        } catch (err) {

        } finally {
            loading.value = false;
        }
    };

    const completeTest = async (token) => {
        if (!sessionId.value) return;
        loading.value = true;
        error.value = null;
        await apiClient.post(`/sessions/${sessionId.value}/complete`);
        currentQuestion.value = null;
        await initSession(token);
        localStorage.removeItem('sessionId')
    };

    const initSession = async (token) => {
        sessionId.value = localStorage.getItem("sessionId");
        if (sessionId.value) {
            try {
                const response = await apiClient.get(`/sessions/${sessionId.value}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                sessionId.value = response.data.id;
                session.value = response.data;
            } catch (err) {
                error.value = err.response?.data?.message || 'An error occurred';
            }
        }
    }

    return {
        sessionId,
        currentQuestion,
        answers,
        session,
        loading,
        initSession,
        error,
        startTest,
        continueTest,
        getNextQuestion,
        submitAnswer,
        completeTest,
    };
});
