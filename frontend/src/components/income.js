import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {EditIncome} from "./editIncome.js";

export class Income {
    constructor() {
        const that = this;
        this.incomeItems = null;
        this.popForDelete = document.getElementById('pop-for-delete');

        this.getIncome();

        this.doNotDelete = document.getElementById('do-not-delete');
        this.doNotDelete.onclick = function () {
            that.hidePopForDelete();
        }
        this.doDelete = document.getElementById('do-delete');

    }

    async getIncome() {
        try {
            const result = await CustomHttp.request(config.hostIncome);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                this.incomeItems = result;

                const that = this;
                const categoryWrapper = document.getElementsByClassName('category-wrapper')[0];
                const createIncomePlus = document.getElementById('create-income-plus');
                if (this.incomeItems && this.incomeItems.length > 0) {
                    this.incomeItems.forEach(item => {

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
                            const idItemIncome = parentElementFromA.getAttribute('data-id');

                            location.href = '#/editIncome';
                            new EditIncome(idItemIncome);
                        }

                        buttonsElement.appendChild(aElement);
                        buttonsElement.appendChild(buttonElement);

                        categoryElement.appendChild(h2Element);
                        categoryElement.appendChild(buttonsElement);


                        categoryWrapper.insertBefore(categoryElement, createIncomePlus);
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
        const idItemIncome = parentElementFromButton.getAttribute('data-id');

        this.doDelete.onclick = function () {
            that.doDeleteItem(idItemIncome);
        }
    }

    hidePopForDelete() {
        this.popForDelete.className = 'modal d-none justify-content-center align-items-center';
    }

    async doDeleteItem(idItemIncome) {
        try {
            const result = await CustomHttp.request(config.hostIncome + '/' + idItemIncome, "DELETE");

            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                location.href = '#/income';
            }

        } catch (error) {
            console.log(error);
        }

    }

}