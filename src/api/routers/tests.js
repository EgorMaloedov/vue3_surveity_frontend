import apiClient from "../client.js";
import {AxiosError} from "axios";

/**
 * Function to create a test.
 * @param {Object} testData - Test data.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the created test.
 * @throws {AxiosError} - Error if test creation fails.
 */
export const apiCreateTest = async (testData, token) => {
    try {
        const response = await apiClient.post('/tests', testData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Test creation failed');
        }
        throw error;
    }
};

/**
 * Function to update a test.
 * @param {string} testId - Test ID.
 * @param {Object} testData - Test data to update.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the updated test.
 * @throws {AxiosError} - Error if test update fails.
 */
export const apiUpdateTest = async (testId, testData, token) => {
    try {
        const response = await apiClient.put(`/tests/${testId}`, testData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Test update failed');
        }
        throw error;
    }
};

/**
 * Function to delete a test.
 * @param {string} testId - Test ID.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to a success message.
 * @throws {AxiosError} - Error if test deletion fails.
 */
export const apiDeleteTest = async (testId, token) => {
    try {
        const response = await apiClient.delete(`/tests/${testId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Test deletion failed');
        }
        throw error;
    }
};

/**
 * Function to get all tests.
 * @param {string} token - Access token.
 * @returns {Promise<Array>} - Promise that resolves to a list of tests.
 * @throws {AxiosError} - Error if getting tests fails.
 */
export const apiGetAllTests = async (token) => {
    try {
        const response = await apiClient.get('/tests', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Failed to get tests');
        }
        throw error;
    }
};

/**
 * Function to get a test by ID.
 * @param {string} testId - Test ID.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the test data.
 * @throws {AxiosError} - Error if getting the test fails.
 */
export const apiGetTestById = async (testId, token) => {
    try {
        const response = await apiClient.get(`/tests/${testId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Failed to get test');
        }
        throw error;
    }
};

/**
 * Function to generate a test link.
 * @param {string} testId - Test ID.
 * @param {string} linkType - Type of link ('web' or 'telegram').
 * @param {string} token - Access token.
 * @param exparation
 * @returns {Promise<Object>} - Promise that resolves to the generated link.
 * @throws {AxiosError} - Error if generating the link fails.
 */
export const apiGenerateTestLink = async (testId, linkType, token, exparation) => {
    try {
        const response = await apiClient.post(`/tests/${testId}/generate_link`, {
            link_type: linkType,
            lifetime: exparation
        },{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Failed to generate link');
        }
        throw error;
    }
};

/**
 * Function to generate a test link.
 * @param {string} testId - Test ID.
 * @param {string} linkType - Type of link ('web' or 'telegram').
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the generated link.
 * @throws {AxiosError} - Error if generating the link fails.
 */
export const apiCloseTestLink = async (testId, linkType, token) => {
    try {
        const response = await apiClient.post(`/tests/${testId}/close_link`, {
            link_type: linkType
        },{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Failed to generate link');
        }
        throw error;
    }
};

/**
 * Function to get test summary by token.
 * @param {string} token - Test token.
 * @returns {Promise<Object>} - Promise that resolves to the test summary.
 * @throws {AxiosError} - Error if getting the test summary fails.
 */
export const apiGetTestSummaryByToken = async (token) => {
    try {
        const response = await apiClient.get('/tests/current/summary', {
            params:{
                token: token
            }
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Failed to get test summary');
        }
        throw error;
    }
};

/**
 * Function to start a test.
 * @param {string} token - Test token.
 * @returns {Promise<Object>} - Promise that resolves to the session ID.
 * @throws {AxiosError} - Error if starting the test fails.
 */
export const apiStartTest = async (token) => {
    try {
        const response = await apiClient.post('/tests/start', { token });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Failed to start test');
        }
        throw error;
    }
};

/**
 * Function to get the next question.
 * @param {string} sessionId - Session ID.
 * @returns {Promise<Object>} - Promise that resolves to the next question.
 * @throws {AxiosError} - Error if getting the next question fails.
 */
export const apiGetNextQuestion = async (sessionId) => {
    try {
        const response = await apiClient.get('/tests/next_question', {
            params: {
                session_id: sessionId,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Failed to get next question');
        }
        throw error;
    }
};

/**
 * Function to submit an answer.
 * @param {string} sessionId - Session ID.
 * @param {string} questionId - Question ID.
 * @param {string} answerId - Answer ID.
 * @returns {Promise<Object>} - Promise that resolves to a success message.
 * @throws {AxiosError} - Error if submitting the answer fails.
 */
export const apiSubmitAnswer = async (sessionId, questionId, answerId) => {
    try {
        const response = await apiClient.post('/tests/submit_answer', { session_id: sessionId, question_id: questionId, answer_id: answerId });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Failed to submit answer');
        }
        throw error;
    }
};

/**
 * Function to complete a test.
 * @param {string} sessionId - Session ID.
 * @returns {Promise<Object>} - Promise that resolves to a success message.
 * @throws {AxiosError} - Error if completing the test fails.
 */
export const apiCompleteTest = async (sessionId) => {
    try {
        const response = await apiClient.post('/tests/complete', { session_id: sessionId });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Failed to complete test');
        }
        throw error;
    }
};

/**
 * Function to create a question.
 * @param {string} testId - Test ID.
 * @param {Object} questionData - Question data.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the created question.
 * @throws {AxiosError} - Error if question creation fails.
 */
export const apiCreateQuestion = async (testId, questionData, token) => {
    try {
        const response = await apiClient.post(`/tests/${testId}/questions`, questionData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response?.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Question creation failed');
        }
        throw error;
    }
};

/**
 * Function to update a question.
 * @param {string} questionId - Question ID.
 * @param {Object} questionData - Question data to update.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the updated question.
 * @throws {AxiosError} - Error if question update fails.
 */
export const apiUpdateQuestion = async (questionId, questionData, token) => {
    try {
        const response = await apiClient.put(`/questions/${questionId}`, questionData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Question update failed');
        }
        throw error;
    }
};

/**
 * Function to delete a question.
 * @param {string} questionId - Question ID.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to a success message.
 * @throws {AxiosError} - Error if question deletion fails.
 */
export const apiDeleteQuestion = async (questionId, token) => {
    try {
        const response = await apiClient.delete(`/questions/${questionId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Question deletion failed');
        }
        throw error;
    }
};

/**
 * Function to create an answer.
 * @param {string} questionId - Question ID.
 * @param {Object} answerData - Answer data.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the created answer.
 * @throws {AxiosError} - Error if answer creation fails.
 */
export const apiCreateAnswer = async (questionId, answerData, token) => {
    try {
        const response = await apiClient.post(`/questions/${questionId}/answers`, answerData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Answer creation failed');
        }
        throw error;
    }
};

/**
 * Function to update an answer.
 * @param {string} answerId - Answer ID.
 * @param {Object} answerData - Answer data to update.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the updated answer.
 * @throws {AxiosError} - Error if answer update fails.
 */
export const apiUpdateAnswer = async (answerId, answerData, token) => {
    try {
        const response = await apiClient.put(`/answers/${answerId}`, answerData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Answer update failed');
        }
        throw error;
    }
};

/**
 * Function to create a test with questions and answers.
 * @param {Object} testData - Test data including questions and answers.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the created test.
 * @throws {AxiosError} - Error if test creation fails.
 */
export const apiCreateTestWithQuestions = async (testData, token) => {
    try {
        const response = await apiClient.post('/tests/with_questions_and_answers', testData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Test creation with questions failed');
        }
        throw error;
    }
};

/**
 * Function to create a test with questions and answers.
 * @param {Object} testData - Test data including questions and answers.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to the created test.
 * @throws {AxiosError} - Error if test creation fails.
 */
export const apiUpdateTestWithQuestions = async (testData, token) => {
    try {
        const response = await apiClient.put(`/tests/${testData.id}/with_questions_and_answers`, testData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Test update with questions failed');
        }
        throw error;
    }
};

/**
 * Function to delete an answer.
 * @param {string} answerId - Answer ID.
 * @param {string} token - Access token.
 * @returns {Promise<Object>} - Promise that resolves to a success message.
 * @throws {AxiosError} - Error if answer deletion fails.
 */
export const apiDeleteAnswer = async (answerId, token) => {
    try {
        const response = await apiClient.delete(`/answers/${answerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Answer deletion failed');
        }
        throw error;
    }
};