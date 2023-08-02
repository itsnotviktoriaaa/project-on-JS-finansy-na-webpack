import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {TranslateErrorFromBackend} from "../services/Translate-error-from-backend.js";

export class CreateIncome {
    constructor() {
        this.createIncomeItem = document.getElementById('create-income-item');
        this.createIncomeItemName = document.getElementById('create-income-item-name');
        this.errorBlock = document.getElementById('error');
        this.messageErrorOnRussian = null;
        this.messageError = null;

        const that = this;
        this.createIncomeItem.onclick = function () {
            that.createIncomeItemElement();
        }

        this.createIncomeItemName.onchange = function () {
            that.init();
        }

    }

    async createIncomeItemElement() {
        try {
            const result = await CustomHttp.request(config.hostIncome, "POST", {
                title: this.createIncomeItemName.value
            });

            //если result = null, то автоматически переведёт на главную
            if (result) {
                if (result.error) {
                    this.messageError = result.message;
                    throw new Error(result.message);
                }

                location.href = '#/income';
            }
        } catch (error) {
            this.errorBlock.className = 'd-block text-danger mb-2';
            this.messageErrorOnRussian = TranslateErrorFromBackend.getTranslatedText(this.messageError);
            this.errorBlock.innerText = this.messageErrorOnRussian;
            console.log(error);
        }

    }

    init() {
        if (this.createIncomeItemName.value) {
            this.createIncomeItem.className = 'btn btn-success';
            this.createIncomeItem.removeAttribute('disabled');
            this.errorBlock.className = 'd-none text-danger';
        }
        if (!this.createIncomeItemName.value) {
            this.createIncomeItem.className = 'btn btn-success disabled';
            this.createIncomeItem.setAttribute('disabled', 'disabled');
        }

        if (this.createIncomeItemName.value.match(/^\s*$/)) {
            this.createIncomeItem.className = 'btn btn-success disabled';
            this.createIncomeItem.setAttribute('disabled', 'disabled');
            this.errorBlock.className = 'd-block text-danger';
            this.errorBlock.innerText = 'Пустое значение нельзя создать';
        }
    }

}