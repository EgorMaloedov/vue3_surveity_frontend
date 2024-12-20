// types.js

/**
 * @typedef {Object} Test
 * @property {string} id - ID теста.
 * @property {string} title - Название теста.
 * @property {string} description - Описание теста.
 * @property {string} type - Тип теста ('test' или 'survey').
 * @property {Object} options - Опции теста.
 * @property {boolean} is_private - Приватный ли тест.
 * @property {boolean} is_anonymous - Анонимный ли тест.
 * @property {Array} user_inputs - Входные данные пользователя.
 * @property {Date} end_date - Дата окончания теста.
 * @property {Date} start_date - Дата начала теста.
 * @property {Date} created_at - Дата создания теста.
 * @property {Date} updated_at - Дата обновления теста.
 * @property {string} user_id - ID пользователя.
 * @property {string} auth_token - Токен авторизации.
 * @property {Array<Question>} questions - Вопросы теста.
 */

/**
 * @typedef {Object} Question
 * @property {string} id - ID вопроса.
 * @property {string} text - Текст вопроса.
 * @property {string} type - Тип вопроса ('radio', 'checkbox', 'textarea').
 * @property {string} test_id - ID теста, к которому относится вопрос.
 * @property {Date} created_on - Дата создания вопроса.
 * @property {Array<Answer>} answers - Ответы на вопрос.
 */

/**
 * @typedef {Object} Answer
 * @property {string} id - ID ответа.
 * @property {string} text - Текст ответа.
 * @property {boolean} is_correct - Правильный ли ответ.
 * @property {string} question_id - ID вопроса, к которому относится ответ.
 * @property {Date} created_on - Дата создания ответа.
 */

export { Test, Question, Answer };
