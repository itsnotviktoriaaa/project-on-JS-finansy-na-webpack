import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {DateManager} from "../utils/date-manager.js";
import {EditIncomeExpenses} from "./editIncomeExpenses.js";
import {CreateIncomeExpenses} from "./createIncomeExpenses.js";
import {Balance} from "./balance.js";

export class IncomeExpenses {
    constructor() {

        this.operations = null;
        this.tableTbody = document.getElementById('table-tbody');

        this.todayDay = new DateManager().init();

        this.init('?period=interval&dateFrom=' + this.todayDay + '&dateTo=' + this.todayDay);

        this.todayButton = document.getElementById('today-button');
        this.weekButton = document.getElementById('week-button');
        this.monthButton = document.getElementById('month-button');
        this.yearButton = document.getElementById('year-button');
        this.allButton = document.getElementById('all-button');
        this.intervalButton = document.getElementById('interval-button');

        const that = this;

        this.todayButton.onclick = function () {
            that.getWeekInfo.call(that, this, 'сегодня');
        }

        this.weekButton.onclick = function () {
            that.getWeekInfo.call(that, this, 'неделя');
        }

        this.monthButton.onclick = function () {
            that.getWeekInfo.call(that, this, 'месяц');
        }

        this.yearButton.onclick = function () {
            that.getWeekInfo.call(that, this, 'год');
        }

        this.allButton.onclick = function () {
            that.getWeekInfo.call(that, this, 'все');
        }

        this.intervalButton.onclick = function () {
            that.getWeekInfo.call(that, this, 'интервал');
        }

        this.popForDelete = document.getElementById('pop-for-delete');
        this.doNotDelete = document.getElementById('do-not-delete');
        this.doNotDelete.onclick = function () {
            that.hidePopForDelete();
        }
        this.doDelete = document.getElementById('do-delete');

        this.dateFrom = document.getElementById('date-from');
        this.dateTo = document.getElementById('date-to');

        this.createIncome = document.getElementById('create-income');
        this.createIncome.onclick = function () {
            location.href = '#/createIncomeExpenses';
            new CreateIncomeExpenses('income');
        }

        this.createExpenses = document.getElementById('create-expenses');
        this.createExpenses.onclick = function () {
            location.href = '#/createIncomeExpenses';
            new CreateIncomeExpenses('expenses');
        }


    }

    async init(operation) {
        try {
            const result = await CustomHttp.request(config.hostOperations + operation);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                this.operations = result;

                let numberOperation = 1;

                this.operations.forEach(item => {

                    const tr = document.createElement('tr');
                    tr.setAttribute('data-id', item.id);

                    const getId = tr.getAttribute('data-id');

                    const th = document.createElement('th');
                    th.setAttribute('scope', 'row');

                    th.innerText = numberOperation++;


                    const td = document.createElement('td');
                    if (item.type === 'income') {
                        td.innerText = 'доход';
                        td.className = 'text-success';
                    } else if (item.type === 'expense') {
                        td.innerText = 'расход';
                        td.className = 'text-danger';
                    }

                    const tdNameCategory = document.createElement('td');
                    tdNameCategory.innerText = item.category;

                    const tdAmount = document.createElement('td');
                    tdAmount.innerText = item.amount;

                    const tdDate = document.createElement('td');
                    tdDate.innerText = item.date;

                    const tdComment = document.createElement('td');
                    tdComment.innerText = item.comment;
                    tdComment.className = 'td-short';


                    const tdButtons = document.createElement('td');
                    const imgButtonDelete = document.createElement('img');
                    imgButtonDelete.setAttribute('role', 'button');
                    imgButtonDelete.setAttribute('src', 'images/trash.png');
                    imgButtonDelete.setAttribute('alt', 'Удалить');
                    imgButtonDelete.className = 'img-button-delete';

                    const that = this;
                    imgButtonDelete.onclick = function () {
                        that.showPopForDelete.call(that, getId);
                    }

                    const imgButtonEdit = document.createElement('img');
                    imgButtonEdit.setAttribute('role', 'button');
                    imgButtonEdit.setAttribute('src', 'images/pen.png');
                    imgButtonEdit.setAttribute('alt', 'Редактировать');
                    imgButtonEdit.className = 'img-button-edit';

                    imgButtonEdit.onclick = function () {

                        location.href = '#/editIncomeExpenses';
                        new EditIncomeExpenses(getId);
                    }

                    tdButtons.appendChild(imgButtonDelete);
                    tdButtons.appendChild(imgButtonEdit);

                    tr.appendChild(th);
                    tr.appendChild(td);
                    tr.appendChild(tdNameCategory);
                    tr.appendChild(tdAmount);
                    tr.appendChild(tdDate);
                    tr.appendChild(tdComment);
                    tr.appendChild(tdButtons);

                    this.tableTbody.appendChild(tr);

                });


            }

        } catch (error) {
            console.log(error);
        }

    }

    getWeekInfo(button, nameOfButton) {
        const allButtonForCall = document.getElementsByClassName('btn-common');

        for (let i = 0; allButtonForCall.length > i; i++) {
            allButtonForCall[i].className = 'btn btn-common btn-outline-secondary fw-semibold';
        }

        button.className = "btn btn-common btn-secondary fw-semibold";

        if (nameOfButton === 'сегодня') {
            this.tableTbody.innerHTML = '';
            this.init('?period=interval&dateFrom=' + this.todayDay + '&dateTo=' + this.todayDay);
        }

        if (nameOfButton === 'неделя') {
            this.tableTbody.innerHTML = '';
            this.init('?period=week');
        }

        if (nameOfButton === 'месяц') {
            this.tableTbody.innerHTML = '';
            this.init('?period=month');
        }


        if (nameOfButton === 'год') {
            this.tableTbody.innerHTML = '';
            this.init('?period=year');
        }

        if (nameOfButton === 'все') {
            this.tableTbody.innerHTML = '';
            this.init('?period=all');
        }

        if (nameOfButton === 'интервал') {
            this.tableTbody.innerHTML = '';
            this.init('?period=interval&dateFrom='+ this.dateFrom.value + '&dateTo=' + this.dateTo.value);
        }

    }

    showPopForDelete(id) {
        const that = this;
        this.popForDelete.className = 'modal d-flex justify-content-center align-items-center';

        this.doDelete.onclick = function () {
            that.doDeleteItem(id);
        }
    }

    hidePopForDelete() {
        this.popForDelete.className = 'modal d-none justify-content-center align-items-center';
    }

    async doDeleteItem(id) {
        try {
            const result = await CustomHttp.request(config.hostOperations + '/' + id, 'DELETE');
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                location.href = '#/incomeExpenses';
                new Balance();

            }

        } catch (error) {
            console.log(error);
        }
    }


}
