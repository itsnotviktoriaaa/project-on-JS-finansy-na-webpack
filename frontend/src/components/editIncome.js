import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class EditIncome {
    constructor(idItemIncome) {
        this.editIncomeItem = null;
        this.errorBlock = null;
        this.messageError = null;
        this.getNameOfIncomeItem(idItemIncome);
    }

    async getNameOfIncomeItem(idItemIncome) {
        try {
            const result = await CustomHttp.request(config.hostIncome + '/' + idItemIncome);

            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                const editIncomeItemName = document.getElementById('edit-income-item-name');
                editIncomeItemName.value = result.title;

                const that = this;
                this.editIncomeItem = document.getElementById('edit-income-item');
                this.editIncomeItem.onclick = function () {
                    that.changeIncomeItemElement(editIncomeItemName.value, idItemIncome);
                }

                editIncomeItemName.onchange = function () {
                    that.init();
                }

                this.errorBlock = document.getElementById('error');

            }
        } catch (error) {
            console.log(error);
        }
    }

    async changeIncomeItemElement(valueOfItem, idItemIncome) {

        try {
            const result = await CustomHttp.request(config.hostIncome + '/' + idItemIncome, "PUT", {
                title: valueOfItem
            });

            if (result) {
                if (result.error) {
                    this.messageError = result.message;
                    throw new Error(result.message);
                }

                location.href = '#/income';

            }
        } catch (error) {
            this.errorBlock.className = 'd-block text-danger mb-2';
            this.errorBlock.innerText = this.messageError;
            console.log(error);
        }

    }

    init() {
        const editIncomeItemName = document.getElementById('edit-income-item-name');
        if (editIncomeItemName.value) {
            this.editIncomeItem.className = 'btn btn-success';
            this.editIncomeItem.removeAttribute('disabled');
            this.errorBlock.className = 'd-none text-danger';
        }
        if (!editIncomeItemName.value) {
            this.editIncomeItem.className = 'btn btn-success disabled';
            this.editIncomeItem.setAttribute('disabled', 'disabled');
        }

        if (editIncomeItemName.value.match(/^\s*$/)) {
            this.editIncomeItem.className = 'btn btn-success disabled';
            this.editIncomeItem.setAttribute('disabled', 'disabled');
            this.errorBlock.className = 'd-block text-danger';
            this.errorBlock.innerText = 'Пустое значение нельзя сохранить';
        }
    }

}