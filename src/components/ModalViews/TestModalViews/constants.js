

// Базовый объект для нового вопроса
import {v6} from "uuid";

export const emptyTestQuestion = {
    title: "",
    answers: [],
    type: "empty",
    test_type: "test",
    required: false,
};

// Опции выбора типа
export const selectOptions = [
    { value: "test", label: "Тест" },
    // { value: "survey", label: "Опрос" },
];

// Опции для чекбоксов в тестах
export const testCheckboxOptions = [
    { value: "password", label: "Приватный тест" },
    { value: "description", label: "Подробное описание теста" },
    { value: "complete_time", label: "Ограничение времени прохождения" },
];

// Опции для чекбоксов в опросах
export const surveyCheckboxOptions = [
    { value: "password", label: "Приватный опрос" },
    { value: "description", label: "Подробное описание опроса" },
    { value: "user_inputs", label: "Анонимный опрос" },
    { value: "complete_time", label: "Ограничение времени прохождения" },
];

// Функция для минимальной даты окончания
export const calculateMinEndDate = (startDate) => {
    return new Date(new Date(startDate).getTime() + 30 * 60 * 1000); // Минимум 30 минут после старта
};

export const emptyTest = {
    id: v6(),
    type: "test",
    options: {
        description: false,
        user_inputs: false,
        password: false,
        complete_time: true,
    },
    description: '',
    user_inputs: [],
    password: '',
    end_date: new Date(new Date().getTime() + 30 * 60 * 1000), // Через 30 минут
    start_date: new Date(),
    questions: [],
    complete_time: {
        hours: 0,
        minutes: 0,
        seconds: 0,
    },
};

export const emptySurvey = {
    id: v6(),
    type: "survey",
    options: {
        description: false,
        user_inputs: true,
        password: false,
        complete_time: false,
    },
    description: '',
    password: '',
    user_inputs: [],
    end_date: new Date(new Date().getTime() + 30 * 60 * 1000), // Через 30 минут
    start_date: new Date(),
    questions: [],
    complete_time: {
        hours: 0,
        minutes: 0,
        seconds: 0,
    },
};
