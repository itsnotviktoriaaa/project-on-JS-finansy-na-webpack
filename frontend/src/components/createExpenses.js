import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {TranslateErrorFromBackend} from "../services/Translate-error-from-backend.js";

export class CreateExpenses {
    constructor() {
        this.createExpensesItem = document.getElementById('create-expenses-item');
        this.createExpensesItemName = document.getElementById('create-expenses-item-name');
        this.errorBlock = document.getElementById('error');
        this.messageErrorOnRussian = null;
        this.messageError = null;

        const that = this;
        this.createExpensesItem.onclick = function () {
            that.createExpensesItemElement();
        }

        this.createExpensesItemName.onchange = function () {
            that.init();
        }

    }

    async createExpensesItemElement() {
        try {
            const result = await CustomHttp.request(config.hostExpenses, "POST", {
                title: this.createExpensesItemName.value
            });

            //если result = null, то автоматически переведёт на главную
            if (result) {
                if (result.error) {
                    this.messageError = result.message;
                    throw new Error(result.message);
                }

                location.href = '#/expenses';
            }
        } catch (error) {
            this.errorBlock.className = 'd-block text-danger mb-2';
            this.messageErrorOnRussian = TranslateErrorFromBackend.getTranslatedText(this.messageError);
            this.errorBlock.innerText = this.messageErrorOnRussian;
            console.log(error);
        }

    }

    init() {
        if (this.createExpensesItemName.value) {
            this.createExpensesItem.className = 'btn btn-success';
            this.createExpensesItem.removeAttribute('disabled');
            this.errorBlock.className = 'd-none text-danger';
        }
        if (!this.createExpensesItemName.value) {
            this.createExpensesItem.className = 'btn btn-success disabled';
            this.createExpensesItem.setAttribute('disabled', 'disabled');
        }

        if (this.createExpensesItemName.value.match(/^\s*$/)) {
            this.createExpensesItem.className = 'btn btn-success disabled';
            this.createExpensesItem.setAttribute('disabled', 'disabled');
            this.errorBlock.className = 'd-block text-danger';
            this.errorBlock.innerText = 'Пустое значение нельзя создать';
        }
    }

}