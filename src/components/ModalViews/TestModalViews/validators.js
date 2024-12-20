// Проверка: название опроса
const validateTitle = (title) => {
    if (!title || !title.trim()) {
        return "Название опроса не может быть пустым.";
    }
    return null;
};

// Проверка: дата окончания после даты начала
const validateDates = (startDate, endDate) => {
    if (startDate >= endDate) {
        return "Дата окончания должна быть позже даты начала.";
    }
    return null;
};

// Проверка: наличие хотя бы одного вопроса
const validateQuestions = (questions) => {
    if (!questions || questions.length === 0) {
        return "Добавьте хотя бы один вопрос.";
    }
    return null;
};

const validateQuestionsNames = (questions) => {
    for (const [index, question] of questions.entries()) { // Используем .entries() для доступа к индексу
        if (!question.title || question.title.trim().length === 0) { // Проверка на пустую строку
            return `Имя вопроса не должно быть пустым. Ошибка в вопросе №${index + 1}`;
        }
    }
    return null;
};

const validateTime = (start_time, end_time, complete_time) => {
    const timeInMilliseconds = complete_time.hour * 60 + complete_time.minutes * 60 + complete_time.seconds * 1000;
    if (new Date(start_time).getTime() + timeInMilliseconds > new Date(end_time).getTime()) {
        return 'У пользователя должно быть время на прохождение опроса, заканчивающееся раньше конечной даты'
    }
    return null;
}

const validateTimeByMinimum = (complete_time) => {
    if (complete_time.hours * 60 + complete_time.minutes * 60 + complete_time.seconds < 600) { //10 Минут - минимально
        return 'Минимальное ограничение времени на прохождение теста - 10 минут'
    }
    return null;
}

const validatePassword = (password) => {
    if (password.length < 6) {
        return 'Пароль должен содержать минимум 6 символов';
    }

    // Проверка на наличие хотя бы одной заглавной буквы
    if (!/[A-Z]/.test(password)) {
        return 'Пароль должен содержать хотя бы одну заглавную букву';
    }

    // Проверка на наличие хотя бы одной строчной буквы
    if (!/[a-z]/.test(password)) {
        return 'Пароль должен содержать хотя бы одну строчную букву';
    }

    // Проверка на наличие хотя бы одной цифры
    if (!/\d/.test(password)) {
        return 'Пароль должен содержать хотя бы одну цифру';
    }

    // Если все проверки прошли успешно, возвращаем null (валидный пароль)
    return null;
}

const validateDescription = (description) => {
    // Проверка на пустое описание
    if (!description || description.trim() === '') {
        return 'Описание не может быть пустым';
    }

    // Проверка на минимальную длину (например, 10 символов)
    if (description.length < 10) {
        return 'Описание должно содержать минимум 10 символов';
    }

    // Проверка на максимальную длину (например, 500 символов)
    if (description.length > 500) {
        return 'Описание не может быть длиннее 500 символов';
    }

    // Проверка на наличие запрещённых символов, например, <, >, &, и т.д.
    const forbiddenChars = /[<>]/;
    if (forbiddenChars.test(description)) {
        return 'Описание не может содержать запрещённые символы (<, >)';
    }

    // Если все проверки прошли успешно, возвращаем null (валидное описание)
    return null;
}

// Валидация названий ответов
const validateAnswerText = (answers) => {
    if (answers.length === 0) {
        return `Каждый вопрос должен содержать минимум 1 ответ`;
    }

    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];

        // Проверка на пустой текст
        if (!answer.text || answer.text.trim() === '') {
            return `Ответ ${i + 1} не может быть пустым`;
        }

        // Проверка на минимальную длину текста (например, 3 символа)
        if (answer.text.length < 3) {
            return `Ответ ${i + 1} должен содержать минимум 3 символа`;
        }

        // Проверка на максимальную длину текста (например, 200 символов)
        if (answer.text.length > 200) {
            return `Ответ ${i + 1} не может быть длиннее 200 символов`;
        }

        // Проверка на наличие запрещённых символов (например, <, >, &, и т.д.)
        const forbiddenChars = /[<>&]/;
        if (forbiddenChars.test(answer.text)) {
            return `Ответ ${i + 1} не может содержать запрещённые символы (<, >, &)`;
        }
    }
    return null; // Если все ответы прошли проверки
};

// Валидация для поля userInputs
const validateUserInputs = (userInputs) => {
    if (userInputs.length === 0) {
        return `Пользовательские поля ввода не должны быть пустыми`;
    }

    for (let i = 0; i < userInputs.length; i++) {
        const input = userInputs[i];

        // Проверка типа (должно быть одно из значений "text", "email", "password", "textarea")
        const validTypes = ["text", "email", "password", "textarea"];
        if (!validTypes.includes(input.type)) {
            return `Тип в поле userInput ${i + 1} должен быть одним из: "text", "email", "password", "textarea"`;
        }

        // Проверка isRequired (должно быть булевым значением)
        if (typeof input.isRequired !== "boolean") {
            return `Поле isRequired в userInput ${i + 1} должно быть булевым значением`;
        }

        // Проверка на минимальную и максимальную длину title
        if (typeof input.title !== "string" || input.title.length < 1 || input.title.length > 128) {
            return `Название (title) в поле userInput ${i + 1} должно быть строкой от 1 до 128 символов`;
        }

        // Проверка значения default (если оно есть, то это строка)
        if (input.default && typeof input.default !== "string") {
            return `Поле default в userInput ${i + 1} должно быть строкой, если оно указано`;
        }
    }

    return null; // Если все проверки прошли успешно
};


export const validateTest = (test) => {
    const errors = [];

    // Валидация названия теста
    const titleError = validateTitle(test.title);
    if (titleError) errors.push(titleError);

    // Валидация дат теста
    const dateError = validateDates(test.start_date, test.end_date);
    if (dateError) errors.push(dateError);

    // Валидация вопросов
    const questionsError = validateQuestions(test.questions);
    if (questionsError) errors.push(questionsError);

    // Валидация названий вопросов
    const questionNameErrors = validateQuestionsNames(test.questions);
    if (questionNameErrors) errors.push(questionNameErrors);

    // Валидация текста ответов для каждого вопроса
    for (let i = 0; i < test.questions.length; i++) {
        const answersError = validateAnswerText(test.questions[i].answers);
        if (answersError) errors.push(answersError);
    }

    // Валидация времени
    if (test.start_time && test.end_time && test.complete_time) {
        const timeError = validateTime(test.start_time, test.end_time, test.complete_time);
        if (timeError) errors.push(timeError);
    }

    // Валидация минимального времени
    if (test.options['complete_time'] && test.complete_time) {
        const timeByMinError = validateTimeByMinimum(test.complete_time);
        if (timeByMinError) errors.push(timeByMinError);
    }

    // Валидация пароля
    if (test.options['password'] && test.password) {
        const passwordError = validatePassword(test.password);
        if (passwordError) errors.push(passwordError);
    }

    // Валидация описания
    if (test.options['description'] && test.description) {
        const descriptionError = validateDescription(test.description);
        if (descriptionError) errors.push(descriptionError);
    }

    if (test.options['user_inputs'] && test.user_inputs) {
        const userInputsError = validateUserInputs(test.user_inputs);
        if (userInputsError) errors.push(userInputsError);
    }

    return errors; // Возвращаем массив ошибок
};
