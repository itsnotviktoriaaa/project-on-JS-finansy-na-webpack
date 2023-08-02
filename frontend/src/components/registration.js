import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/Auth.js";
import config from "../../config/config.js";

export class Registration {
    constructor(page) {

        this.processElement = document.getElementById('process');
        this.rememberElement = document.getElementById('remember-me');
        this.rememberMe = false;
        this.page = page;
        this.errorBlock = document.getElementById('error');
        this.messageError = null;


        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                invalidFeedback: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                invalidFeedback: null,
                valid: false
            }
        ]

        if (this.page === 'registration') {
            this.fields.find(item => {
                return item.name === 'password';
            }).regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
            this.fields.unshift({
                    name: 'fullName',
                    id: 'full-name',
                    element: null,
                    invalidFeedback: null,
                    regex: /([А-ЯЁ][а-яё]+\s+){2}([А-ЯЁ][а-яё]+\s*)/,
                    valid: false
                },
                {
                    name: 'passwordRepeat',
                    id: 'password-repeat',
                    element: null,
                    invalidFeedback: null,
                    regex: null,
                    valid: false
                });
        }
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.invalidFeedback = document.getElementById(item.id).nextElementSibling;
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.rememberElement.onclick = function() {
            that.rememberCheck.call(that, this);
        }

        this.processElement.onclick = function () {
            that.processForm();
        }

    }

    validateField(field, element) {

        this.fieldPassword = null;
        this.fieldPasswordElementValue = null;
        this.fieldPasswordRepeat = null;

        if (this.page === 'registration') {
            this.fieldPassword = this.fields.find(item => item.name === 'password');
            this.fieldPasswordElementValue = this.fieldPassword.element.value;

            this.fieldPasswordRepeat = this.fields.find(item => item.name === 'passwordRepeat');
            this.fieldPasswordRepeat.regex = new RegExp('^' + this.fieldPasswordElementValue + '$');
        }

        if (!element.value || !element.value.match(field.regex)) {
            element.previousElementSibling.style.borderColor = "red";
            element.style.borderColor = "red";
            field.invalidFeedback.style.display = "block";
            field.valid = false;
        } else {
            element.previousElementSibling.removeAttribute('style');
            element.removeAttribute('style');
            field.invalidFeedback.style.display = "none";
            field.valid = true;
        }

        if (this.page === 'registration') {
            if (field.name === 'password' && this.fieldPasswordRepeat.element.value) {
                this.validateField(this.fieldPasswordRepeat, this.fieldPasswordRepeat.element);
            }
        }

        this.rememberMe = this.rememberElement.checked;

        this.validateForm();

    }


    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    rememberCheck(element) {
        this.rememberMe = element.checked;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'registration') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === "fullName").element.value.split(' ')[1],
                        lastName: this.fields.find(item => item.name === "fullName").element.value.split(' ')[0],
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === "passwordRepeat").element.value
                    });
                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }

                } catch (error) {
                    return console.log(error);
                }
            }

            //будет происходить в любом случае то, что ниже, независимо от того, на какой странице находимся (login или registration)
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: this.fields.find(item => item.name === 'email').element.value,
                    password: this.fields.find(item => item.name === 'password').element.value,
                    rememberMe: this.rememberMe
                });

                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken
                        || !result.user.name || !result.user.lastName || !result.user.id) {
                        this.messageError = result.message;
                        throw new Error (result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        id: result.user.id
                    });
                    location.href = '#/grafika';
                }

            } catch (error) {
                this.errorBlock.className = 'd-block text-danger mb-2';
                this.errorBlock.innerText = this.messageError;
                console.log(error);
            }

        }
    }

}