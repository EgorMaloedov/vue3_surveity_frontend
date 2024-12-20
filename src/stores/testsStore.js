import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import apiClient from "../api/client.js";
import {
    apiCloseTestLink,
    apiCompleteTest,
    apiCreateAnswer,
    apiCreateQuestion,
    apiCreateTest,
    apiCreateTestWithQuestions, // Добавлен импорт новой функции
    apiDeleteAnswer,
    apiDeleteQuestion,
    apiDeleteTest,
    apiGenerateTestLink,
    apiGetAllTests,
    apiGetNextQuestion,
    apiGetTestById,
    apiGetTestSummaryByToken,
    apiStartTest,
    apiSubmitAnswer,
    apiUpdateAnswer,
    apiUpdateQuestion,
    apiUpdateTest, apiUpdateTestWithQuestions
} from '../api/routers/tests.js';
import { useAuthStore } from "./authStore.js";
import question from "../components/ModalViews/TestModalViews/elements/Question.vue";

export const useTestsStore = defineStore('tests', () => {
    const tests = ref(new Map());
    const currentTest = ref(null);
    const isLoading = ref(false);
    const authStore = useAuthStore();
    const accessToken = computed(() => authStore.accessToken);
    const testPayload = ref()

    /**
     * Установить список тестов.
     * @param {Test[]} newTests - Новый список тестов.
     */
    const setTests = (newTests) => {
        tests.value = new Map();
        newTests.forEach((test) => {
            tests.value.set(test.id, test);
        });
    };

    /**
     * Установить текущий тест.
     * @param {Test|null} test - Текущий тест.
     */
    const setCurrentTest = async (test) => {
        if (test) {
            const response = await apiGetTestById(test.id, accessToken.value);
            response.start_date = new Date(response.start_date);
            response.end_date = new Date(response.end_date);
            if (typeof response.complete_time === 'string') {
                const splited = response.complete_time.split(':');
                response.complete_time = {
                    hours: parseInt(splited[0]),
                    minutes: parseInt(splited[1]),
                    seconds: parseInt(splited[2])
                }
            }
            if (!response.complete_time) {
                response.complete_time = {
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                }
            }
            currentTest.value = response;
            return;
        }
        currentTest.value = test;
    };

    /**
     * Создать новый тест.
     * @param {Test} test - Новый тест.
     * @returns {Promise<string>}
     */
    const createTest = async (test) => {
        try {
            const response = await apiCreateTest(test, accessToken.value);
            const createdTestId = response.id;
            tests.value.set(createdTestId, { ...test, id: createdTestId, questions: [] });
            return createdTestId;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Создать новый тест с вопросами и ответами.
     * @param {Test} test - Новый тест с вопросами и ответами.
     * @returns {Promise<string>}
     */
    const createTestWithQuestions = async (test) => {
        try {
            const response = await apiCreateTestWithQuestions(test, accessToken.value);
            const createdTestId = response.id;
            tests.value.set(createdTestId, { ...test, id: createdTestId });
            return createdTestId;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Обновить тест вопросами и ответами.
     * @param {Test} test - Новый тест с вопросами и ответами.
     * @returns {Promise<string>}
     */
    const updateTestWithQuestions = async (test) => {
        try {
            const response = await apiUpdateTestWithQuestions(test, accessToken.value);
            const updatedId = response.id;
            tests.value.set(updatedId, { ...test, id: updatedId });
            return updatedId;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Обновить существующий тест.
     * @param {Test} updatedTest - Обновлённый тест.
     * @returns {Promise<void>}
     */
    const updateTest = async (updatedTest) => {
        const newTest = JSON.parse(JSON.stringify(updatedTest));
        try {
            isLoading.value = true;
            const id = newTest.id;
            delete newTest.id;
            delete newTest.questions;
            await apiUpdateTest(id, newTest, accessToken.value);
            isLoading.value = false;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Обновить существующий тест.
     * @param {Test} updated - Обновлённый тест.
     * @returns {Promise<void>}
     */
    const updateAllTest = async (updated) => {
        const updatedTest = JSON.parse(JSON.stringify(updated));
        if (tests.value.has(updatedTest.id)) {
            tests.value.set(updatedTest.id, updatedTest);
        }

        // Создаём копию объекта updatedTest без поля questions

        try {
            isLoading.value = true;
            const questions = updatedTest.questions
            const newTest = await updateTest(updatedTest);

            if (questions && questions.length > 0) {
                for (const question of questions) {
                    const answers = question.answers
                    if (!question.id) {
                        // Создаём новый вопрос
                        const newQuestion = await createQuestion(newTest.id, question);
                        question.id = newQuestion.id;
                    } else {
                        // Обновляем существующий вопрос
                        question.id = await updateQuestion(question.id, question);
                    }

                    if (answers && answers.length > 0) {
                        for (const answer of question.answers) {
                            if (!answer.id) {
                                const newAnswer = await createAnswer(question.id, answer);
                                answer.id = newAnswer.id;
                            } else {
                                await updateAnswer(answer.id, answer);
                            }
                        }
                    }
                }
            }

            isLoading.value = false;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Удалить тест.
     * @param {string} id - ID теста.
     * @returns {Promise<void>}
     */
    const removeTest = async (id) => {
        tests.value.delete(id);
        try {
            isLoading.value = true;
            await apiDeleteTest(id, accessToken.value);
            isLoading.value = false;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Получить список тестов пользователя.
     * @returns {Promise<void>}
     */
    const fetchUserTests = async () => {
        isLoading.value = true;
        let response;
        try {
            response = await apiGetAllTests(accessToken.value);
        } catch (error) {
            console.error(error);
        }
        isLoading.value = false;
        setTests(response || []);
    };

    /**
     * Генерировать ссылку для теста.
     * @param {string} type - Тип ссылки ('web' или 'telegram').
     * @returns {Promise<void>}
     */
    const generateTestLink = async (type, exparation) => {
        try {
            isLoading.value = true;
            const response = await apiGenerateTestLink(currentTest.value.id, type, accessToken.value, exparation);
            isLoading.value = false;
            currentTest.value[type === 'telegram' ? 'tgLink' : 'webLink'] = response.link;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Генерировать ссылку для теста.
     * @param {string} type - Тип ссылки ('web' или 'telegram').
     * @returns {Promise<void>}
     */
    const closeTestLink = async (type, ) => {
        try {
            isLoading.value = true;
            await apiCloseTestLink(currentTest.value.id, type, accessToken.value);
            isLoading.value = false;
            currentTest.value[type === 'telegram' ? 'tgLink' : 'webLink'] = null;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Создать новый вопрос.
     * @param {string} testId - ID теста.
     * @param {Question} question - Новый вопрос.
     * @returns {Promise<string>}
     */
    const createQuestion = async (testId, question) => {
        const newQuestion = JSON.parse(JSON.stringify(question));
        try {
            delete newQuestion.id;
            delete newQuestion.answers;
            const response = await apiCreateQuestion(testId, newQuestion, accessToken.value);
            const createdQuestionId = response.id;
            const test = tests.value.get(testId);
            return createdQuestionId;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Обновить существующий вопрос.
     * @param {string} questionId - ID вопроса.
     * @param {Question} updatedQuestion - Обновлённый вопрос.
     * @returns {Promise<void>}
     */
    const updateQuestion = async (questionId, updatedQuestion) => {
        const newQuestion = JSON.parse(JSON.stringify(updatedQuestion));
        try {
            isLoading.value = true;
            delete newQuestion.id;
            delete newQuestion.answers;
            await apiUpdateQuestion(questionId, newQuestion, accessToken.value);
            isLoading.value = false;
            const test = tests.value.get(newQuestion.test_id);
            if (test) {
                const questionIndex = test.questions.findIndex(q => q.id === questionId);
                if (questionIndex !== -1) {
                    test.questions[questionIndex] = newQuestion;
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Удалить вопрос.
     * @param {string} questionId - ID вопроса.
     * @returns {Promise<void>}
     */
    const removeQuestion = async (questionId) => {
        try {
            isLoading.value = true;
            await apiDeleteQuestion(questionId, accessToken.value);
            isLoading.value = false;
            const test = tests.value.get(currentTest.value.id);
            if (test) {
                test.questions = test.questions.filter(q => q.id !== questionId);
            }
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Создать новый ответ.
     * @param {string} questionId - ID вопроса.
     * @param {Answer} answer - Новый ответ.
     * @returns {Promise<void>}
     */
    const createAnswer = async (questionId, answer) => {
        try {
            delete answer.id;
            const response = await apiCreateAnswer(questionId, answer, accessToken.value);
            const createdAnswerId = response.id;
            const test = tests.value.get(currentTest.value.id);
            if (test) {
                const question = test.questions.find(q => q.id === questionId);
                if (question) {
                    question.answers.push({ ...answer, id: createdAnswerId });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Обновить существующий ответ.
     * @param {string} answerId - ID ответа.
     * @param {Answer} updatedAnswer - Обновлённый ответ.
     * @returns {Promise<void>}
     */
    const updateAnswer = async (answerId, updatedAnswer) => {
        const newAnswer = JSON.parse(JSON.stringify(updatedAnswer));
        try {
            isLoading.value = true;
            delete newAnswer.id;
            await apiUpdateAnswer(answerId, newAnswer, accessToken.value);
            isLoading.value = false;
            const test = tests.value.get(currentTest.value.id);
            if (test) {
                const question = test.questions.find(q => q.answers.some(a => a.id === answerId));
                if (question) {
                    const answerIndex = question.answers.findIndex(a => a.id === answerId);
                    if (answerIndex !== -1) {
                        question.answers[answerIndex] = newAnswer;
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Удалить ответ.
     * @param {string} answerId - ID ответа.
     * @returns {Promise<void>}
     */
    const removeAnswer = async (answerId) => {
        try {
            isLoading.value = true;
            await apiDeleteAnswer(answerId, accessToken.value);
            isLoading.value = false;
            const test = tests.value.get(currentTest.value.id);
            if (test) {
                const question = test.questions.find(q => q.answers.some(a => a.id === answerId));
                if (question) {
                    question.answers = question.answers.filter(a => a.id !== answerId);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Начать тест.
     * @param {string} token - Токен теста.
     * @returns {Promise<void>}
     */
    const startTest = async (token) => {
        try {
            const response = await apiStartTest(token);
            currentTest.value.session_id = response.session_id;
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Получить следующий вопрос.
     * @param {string} sessionId - ID сессии.
     * @returns {Promise<void>}
     */
    const getNextQuestion = async (sessionId) => {
        try {
            currentTest.value.current_question = await apiGetNextQuestion(sessionId);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Отправить ответ.
     * @param {string} sessionId - ID сессии.
     * @param {string} questionId - ID вопроса.
     * @param {string} answerId - ID ответа.
     * @returns {Promise<void>}
     */
    const submitAnswer = async (sessionId, questionId, answerId) => {
        try {
            await apiSubmitAnswer(sessionId, questionId, answerId);
        } catch (error) {
            console.error(error);
        }
    };

    const getTestAnswers = async (testId) => {
        try {
            const response = await apiClient.get(`/answers/${testId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken.value}`,
                }
            });

            if (response.data.answers) {
                currentTest.value.sessions = response.data.answers;
            } else {
                error.value = 'No sessions found for the given test_id';
            }
        } catch (err) {
            error.value = err.response?.data?.message || 'An error occurred';
        }
    };

    /**
     * Завершить тест.
     * @param {string} sessionId - ID сессии.
     * @returns {Promise<void>}
     */
    const completeTest = async (sessionId) => {
        try {
            await apiCompleteTest(sessionId);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Получить сводку теста по токену.
     * @param {string} token - Токен теста.
     * @returns {Promise<Object>}
     */
    const getTestSummaryByToken = async (token) => {
        try {
            testPayload.value = await apiGetTestSummaryByToken(token);
        } catch (error) {
            console.error(error);
        }
    };

    return {
        tests,
        currentTest,
        isLoading,
        testPayload,
        setTests,
        setCurrentTest,
        createTest,
        createTestWithQuestions,
        closeTestLink,
        updateTestWithQuestions,
        updateTest,
        removeTest,
        fetchUserTests,
        generateTestLink,
        createQuestion,
        updateQuestion,
        removeQuestion,
        createAnswer,
        updateAllTest,
        updateAnswer,
        removeAnswer,
        startTest,
        getNextQuestion,
        submitAnswer,
        completeTest,
        getTestAnswers,
        getTestSummaryByToken,
    };
});
