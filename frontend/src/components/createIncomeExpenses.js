import config from "../../config/config.js";
import {CustomHttp} from "../services/custom-http.js";
import {Balance} from "./balance.js";

export class CreateIncomeExpenses {
    constructor(type) {
        this.categories = null;
        this.putAmount = null;
        this.putDate = null;
        this.putComment = null;
        this.createIncomeExpensesItemButton = null;
        this.errorBlock = null;
        this.messageError = null;
        this.init(type);
    }

    async init(type) {
        try {
            const result = await CustomHttp.request(config.hostOperations);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                if (type === 'expenses') {
                    const chooseTypeB = document.querySelector('#choose-type option[value=valueB]');
                    chooseTypeB.setAttribute('selected', 'selected');

                    this.getCategory(config.hostExpenses);

                } else if (type === 'income') {
                    const chooseTypeA = document.querySelector('#choose-type option[value=valueA]');
                    chooseTypeA.setAttribute('selected', 'selected');

                    this.getCategory(config.hostIncome);
                }

                const chooseType = document.getElementById('choose-type');
                const that = this;
                chooseType.onchange = function () {
                    if (chooseType.selectedIndex === 1) {
                        that.getCategory(config.hostIncome);
                    } else if (chooseType.selectedIndex === 2) {
                        that.getCategory(config.hostExpenses);
                    }
                }

                this.createIncomeExpensesItemButton = document.getElementById('create-income-expenses-item');

                this.putAmount = document.getElementById('put-amount');
                this.putDate = document.getElementById('put-date');

                this.putComment = document.getElementById('put-comment');

                this.putAmount.onkeydown = function (e) {
                    const charOnlyRegEx = /^[0-9,.]+\s*$/;

                    if(!charOnlyRegEx.test(e.key) && e.code !== "Backspace") return false;

                }

                this.putAmount.onchange = function () {
                    that.checkInputs();
                }

                this.putDate.onchange = function () {
                    that.checkInputs();
                }

                this.putComment.onchange = function () {
                    that.checkInputs();
                }

                this.createIncomeExpensesItemButton.onclick = function () {
                    that.createIncomeExpensesItem();
                }

                this.errorBlock = document.getElementById('error');

            }
        } catch (error) {
            console.log(error);
        }

    }

    async getCategory(host) {
        try {
            const result = await CustomHttp.request(host);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                this.categories = result;

                const chooseCategory = document.getElementById('choose-category');
                chooseCategory.innerHTML = '';
                this.categories.forEach(category => {
                    let option = document.createElement('option');
                    option.className = 'dropdownplus';
                    option.setAttribute('category-id', category.id);
                    option.setAttribute('value', category.title);
                    option.innerText = category.title;

                    chooseCategory.appendChild(option);
                });

                return;

            }

        } catch (error) {
            console.log(error);
        }
    }

    async createIncomeExpensesItem() {

        let typeName = null;
        const chooseType = document.getElementById('choose-type');
        if (chooseType.selectedIndex === 1) {
            typeName = 'income';
        } else if (chooseType.selectedIndex === 2) {
            typeName = 'expense';
        }

        const putAmount = document.getElementById('put-amount');

        const putDate = document.getElementById('put-date');

        const putComment = document.getElementById('put-comment');

        const chooseCategory = document.getElementById('choose-category');
        const chooseCategoryValue = chooseCategory.value;

        const allOptions = [...document.querySelectorAll('#choose-category option')];
        const optionDetermined = allOptions.find(el => el.value === chooseCategoryValue);
        const categoryId = optionDetermined.getAttribute('category-id');

        try {
            const result = await CustomHttp.request(config.hostOperations, 'POST', {
                type: typeName,
                amount: parseFloat(putAmount.value),
                date: putDate.value,
                comment: putComment.value,
                category_id: parseInt(categoryId)
            });

            if (result) {
                if (result.error) {
                    this.messageError = result.message;
                    throw new Error(result.message);
                }

                location.href = '#/incomeExpenses';
                new Balance();

            }

        } catch (error) {
            this.errorBlock.className = 'd-block text-danger mb-2';
            this.errorBlock.innerText = this.messageError;
            console.log(error);
        }
    }

    checkInputs() {

        if (this.putAmount.value && this.putDate.value && this.putComment.value) {
            this.createIncomeExpensesItemButton.removeAttribute('disabled');
            this.createIncomeExpensesItemButton.className = 'btn btn-success';
        }

        if (this.putAmount.value.match(/^\s*$/) || this.putDate.value.match(/^\s*$/) || this.putComment.value.match(/^\s*$/)) {
            this.createIncomeExpensesItemButton.setAttribute('disabled', 'disabled');
            this.createIncomeExpensesItemButton.className = 'btn btn-success disabled';
        }

        if (!this.putAmount.value || !this.putDate.value || !this.putComment.value) {
            this.createIncomeExpensesItemButton.setAttribute('disabled', 'disabled');
            this.createIncomeExpensesItemButton.className = 'btn btn-success disabled';
        }

    }

}