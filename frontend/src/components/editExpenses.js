import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class EditExpenses {
    constructor(idItemExpenses) {
        this.editExpensesItem = null;
        this.errorBlock = null;
        this.messageError = null;
        this.getNameOfExpensesItem(idItemExpenses);
    }

    async getNameOfExpensesItem(idItemExpenses) {
        try {
            const result = await CustomHttp.request(config.hostExpenses + '/' + idItemExpenses);

            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                const editExpensesItemName = document.getElementById('edit-expenses-item-name');
                editExpensesItemName.value = result.title;

                const that = this;
                this.editExpensesItem = document.getElementById('edit-expenses-item');
                this.editExpensesItem.onclick = function () {
                    that.changeExpensesItemElement(editExpensesItemName.value, idItemExpenses);
                }

                editExpensesItemName.onchange = function () {
                    that.init();
                }

                this.errorBlock = document.getElementById('error');

            }
        } catch (error) {
            console.log(error);
        }
    }

    async changeExpensesItemElement(valueOfItem, idItemExpenses) {

        try {
            const result = await CustomHttp.request(config.hostExpenses + '/' + idItemExpenses, "PUT", {
                title: valueOfItem
            });

            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                location.href = '#/expenses';

            }
        } catch (error) {
            console.log(error);
        }

    }

    init() {
        const editExpensesItemName = document.getElementById('edit-expenses-item-name');
        if (editExpensesItemName.value) {
            this.editExpensesItem.className = 'btn btn-success';
            this.editExpensesItem.removeAttribute('disabled');
            this.errorBlock.className = 'd-none text-danger';
        }
        if (!editExpensesItemName.value) {
            this.editExpensesItem.className = 'btn btn-success disabled';
            this.editExpensesItem.setAttribute('disabled', 'disabled');
        }

        if (editExpensesItemName.value.match(/^\s*$/)) {
            this.editExpensesItem.className = 'btn btn-success disabled';
            this.editExpensesItem.setAttribute('disabled', 'disabled');
            this.errorBlock.className = 'd-block text-danger';
            this.errorBlock.innerText = 'Пустое значение нельзя сохранить';
        }
    }

}