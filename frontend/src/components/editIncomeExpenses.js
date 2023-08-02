import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "./balance.js";

export class EditIncomeExpenses {
    constructor(id) {
        this.categories = null;
        this.putAmount = null;
        this.putDate = null;
        this.putComment = null;
        this.editIncomeExpensesItemButton = null;
        this.errorBlock = null;
        this.messageError = null;
        this.init(id);
    }

    async init(id) {
        try {
            const result = await CustomHttp.request(config.hostOperations + '/' + id);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                if (result.type === 'expense') {
                    const chooseTypeB = document.querySelector('#choose-type option[value=valueB]');
                    chooseTypeB.setAttribute('selected', 'selected');

                    this.getCategory(config.hostExpenses, result.category);


                } else if (result.type === 'income') {
                    const chooseTypeA = document.querySelector('#choose-type option[value=valueA]');
                    chooseTypeA.setAttribute('selected', 'selected');

                    this.getCategory(config.hostIncome, result.category);
                }

                this.putAmount = document.getElementById('put-amount');

                this.putAmount.setAttribute('value', result.amount);


                this.putDate = document.getElementById('put-date');

                this.putComment = document.getElementById('put-comment');

                this.putAmount.onkeydown = function (e) {
                    const charOnlyRegEx = /^[0-9,.]+\s*$/;


                    if (!charOnlyRegEx.test(e.key)) return false;

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


                const dateParse = result.date.split('-');
                let dateParseValue = dateParse[2] + '.' + dateParse[1] + '.' + dateParse[0];
                this.putDate.setAttribute('value', dateParseValue);

                let putDateValue = this.putDate.value.split('.');
                let putDateValuePars = putDateValue[2] + '-' + putDateValue[1] + '-' + putDateValue[0];

                this.putDate.onblur = function () {
                    putDateValuePars = this.value;
                }

                this.putComment.setAttribute('value', result.comment);

                const chooseType = document.getElementById('choose-type');
                const that = this;
                chooseType.onchange = function () {
                    if (chooseType.selectedIndex === 1) {
                        that.getCategory(config.hostIncome);
                    } else if (chooseType.selectedIndex === 2) {
                        that.getCategory(config.hostExpenses);
                    }
                }

                this.editIncomeExpensesItemButton = document.getElementById('edit-income-expenses-item');
                this.editIncomeExpensesItemButton.onclick = function () {
                    that.editIncomeExpensesItem(id, putDateValuePars);
                }

                this.errorBlock = document.getElementById('error');

            }

        } catch (error) {
            console.log(error);
        }
    }

    async getCategory(host, categoryName) {
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

                const allOptions = [...document.querySelectorAll('#choose-category option')];
                const optionDetermined = allOptions
                    .find(el => el.value === categoryName);

                optionDetermined.setAttribute('selected', 'selected');

                return;

            }

        } catch (error) {
            console.log(error);
        }
    }

    async editIncomeExpensesItem(id, putDateValuePars) {

        let typeName = null;
        const chooseType = document.getElementById('choose-type');
        if (chooseType.selectedIndex === 1) {
            typeName = 'income';
        } else if (chooseType.selectedIndex === 2) {
            typeName = 'expense';
        }

        const chooseCategory = document.getElementById('choose-category');
        const chooseCategoryValue = chooseCategory.value;

        const allOptions = [...document.querySelectorAll('#choose-category option')];
        const optionDetermined = allOptions.find(el => el.value === chooseCategoryValue);
        const categoryId = optionDetermined.getAttribute('category-id');

        try {
            const result = await CustomHttp.request(config.hostOperations + '/' + id, 'PUT', {
                type: typeName,
                amount: parseFloat(this.putAmount.value),
                date: putDateValuePars,
                comment: this.putComment.value,
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
            this.editIncomeExpensesItemButton.removeAttribute('disabled');
            this.editIncomeExpensesItemButton.className = 'btn btn-success';
        }

        if (this.putAmount.value.match(/^\s*$/) || this.putDate.value.match(/^\s*$/) || this.putComment.value.match(/^\s*$/)) {
            this.editIncomeExpensesItemButton.setAttribute('disabled', 'disabled');
            this.editIncomeExpensesItemButton.className = 'btn btn-success disabled';
        }

        if (!this.putAmount.value || !this.putDate.value || !this.putComment.value) {
            this.editIncomeExpensesItemButton.setAttribute('disabled', 'disabled');
            this.editIncomeExpensesItemButton.className = 'btn btn-success disabled';
        }

    }

}