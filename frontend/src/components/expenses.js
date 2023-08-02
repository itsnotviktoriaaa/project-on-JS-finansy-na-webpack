import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {EditExpenses} from "./editExpenses.js";

export class Expenses {
    constructor() {
        const that = this;
        this.expensesItems = null;
        this.popForDelete = document.getElementById('pop-for-delete');

        this.getExpenses();

        this.doNotDelete = document.getElementById('do-not-delete');

        this.doNotDelete.onclick = function () {
            that.hidePopForDelete();
        }
        this.doDelete = document.getElementById('do-delete');

    }

    async getExpenses() {
        try {
            const result = await CustomHttp.request(config.hostExpenses);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                this.expensesItems = result;

                const that = this;
                const categoryWrapper = document.getElementsByClassName('category-wrapper')[0];
                const createExpensesPlus = document.getElementById('create-expenses-plus');
                if (this.expensesItems && this.expensesItems.length > 0) {
                    this.expensesItems.forEach(item => {

                        const categoryElement = document.createElement('div');
                        categoryElement.className = 'category border border-dark-subtle border-1 rounded-3 py-4 pe-5 ps-4';
                        categoryElement.setAttribute('data-id', item.id);

                        const h2Element = document.createElement('h2');
                        h2Element.className = 'mb-3 fw-semibold';
                        h2Element.innerText = item.title;

                        const buttonsElement = document.createElement('div');
                        buttonsElement.className = 'd-flex gap-2';

                        const aElement = document.createElement('a');
                        aElement.setAttribute('type', 'button');
                        aElement.className = 'btn btn-primary py-2 px-3';
                        aElement.innerText = 'Редактировать';

                        const buttonElement = document.createElement('button');
                        buttonElement.className = 'btn btn-danger py-2 px-3';
                        buttonElement.innerText = 'Удалить';

                        buttonElement.onclick = function () {
                            that.showPopForDelete.call(that, this);
                        }

                        aElement.onclick = function () {
                            const parentElementFromA = this.parentElement.parentElement;
                            const idItemExpenses = parentElementFromA.getAttribute('data-id');

                            location.href = '#/editExpenses';
                            new EditExpenses(idItemExpenses);
                        }

                        buttonsElement.appendChild(aElement);
                        buttonsElement.appendChild(buttonElement);

                        categoryElement.appendChild(h2Element);
                        categoryElement.appendChild(buttonsElement);


                        categoryWrapper.insertBefore(categoryElement, createExpensesPlus);
                    });
                }


            }
        } catch (error) {
            console.log(error);
        }
    }

    showPopForDelete(button) {
        const that = this;
        this.popForDelete.className = 'modal d-flex justify-content-center align-items-center';

        const parentElementFromButton = button.parentElement.parentElement;
        const idItemExpenses = parentElementFromButton.getAttribute('data-id');

        this.doDelete.onclick = function () {
            that.doDeleteItem(idItemExpenses);
        }
    }

    hidePopForDelete() {
        this.popForDelete.className = 'modal d-none justify-content-center align-items-center';
    }

    async doDeleteItem(idItemExpenses) {
        try {
            const result = await CustomHttp.request(config.hostExpenses + '/' + idItemExpenses, "DELETE");

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

}