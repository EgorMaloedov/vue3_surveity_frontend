import { defineStore } from 'pinia';
import { ref } from 'vue';
import {apiRegister, apiLogin, apiAuthenticate} from "../api/routers/auth.js";
import {jwtDecode} from 'jwt-decode';

/**
 * @typedef {Object} User
 * @property {string} id - User ID.
 * @property {string} email - User email.
 */

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const accessToken = ref(null);
    const isAuthenticated = ref(false);
    const authError = ref(null);
    const isLoading = ref(false);

    /**
     * Function to authenticate a user.
     * @param {string} token - Access token.
     */
    const authenticateUser = (token) => {
        if (token) {
            const userPayload = jwtDecode(token);
            isAuthenticated.value = true;
            localStorage.setItem('accessToken', token);
            accessToken.value = token;
            user.value = {
                id: userPayload.id,
                email: userPayload.email
            };
        }
    };

    /**
     * Function to log in a user.
     * @param {string} email - User's email.
     * @param {string} password - User's password.
     * @returns {Promise<void>}
     */
    const login = async (email, password) => {
        try{
            clearError()
            isLoading.value = true;
            const response = await apiLogin(email, password);
            const accessToken = response.access_token;
            authenticateUser(accessToken);
        }
        catch(err){
            authError.value = err.message;
        }
        finally {
            isLoading.value = false;
        }
    };

    /**
     * Function register a user.
     * @param {string} email - User's email.
     * @param {string} password - User's password.
     * @returns {Promise<void>}
     */
    const register = async (email, password) => {
        try{
            clearError()
            isLoading.value = true;
            const response = await apiRegister(email, password);
            const accessToken = response.access_token;
            authenticateUser(accessToken);
        }
        catch(err){
            authError.value = err.message;
        }
        finally {
            isLoading.value = false;
        }
    };

    /**
     * Function to log out a user.
     */
    const logout = () => {
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('accessToken');
        accessToken.value = '';
    };

    /**
     * Function to clear the authentication error.
     */
    const clearError = () => {
        authError.value = null;
    };

    /**
     * Function to authorize a user by token.
     * @returns {Promise<void>}
     */
    const authorizeByToken = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const res = await apiAuthenticate(accessToken);
                if (res) {
                    authenticateUser(accessToken);
                }
            } catch (error) {
                localStorage.removeItem('accessToken');
                isAuthenticated.value = false;
            }
        }
    };

    return {
        user,
        isAuthenticated,
        authError,
        isLoading,
        accessToken,
        clearError,
        authorizeByToken,
        login,
        logout,
        register,
    };
});
