import { AxiosError } from 'axios';
import apiClient from "../client.js";

/**
 * Function to register a user.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<string>} - Promise that resolves to `accessToken`.
 * @throws {AxiosError} - Error if a user with the current email already exists.
 */
export const apiRegister = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/register', { email, password });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.status === 400) {
                throw new AxiosError('Пользователь уже существует');
            }
        }
        throw error;
    }
};

/**
 * Function to log in a user.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<string>} - Promise that resolves to `accessToken`.
 * @throws {AxiosError} - Error if the login data is incorrect.
 */
export const apiLogin = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.status === 401) {
                throw new AxiosError('Неправильные данные для входа');
            }
        }
        throw error;
    }
};

/**
 * Function to authenticate a user.
 * @param {string} token - Access token.
 * @returns {Promise<boolean>} - Promise that resolves to an authenticate status.
 * @throws {AxiosError} - Error if authentication fails.
 */
export const apiAuthenticate = async (token) => {
    try {
        const response = await apiClient.get('/auth/authenticate',  {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return true;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new AxiosError('Authentication failed');
        }
        throw error;
    }
};
