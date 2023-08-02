import {DateManager} from "../utils/date-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Grafika {
    constructor() {
        this.ctx = document.getElementById('myChart');
        this.ctx1 = document.getElementById('myChart1');

        this.myLineChart = null;
        this.myLineChart1 = null;

        this.todayDay = new DateManager().init();

        this.init('?period=interval&dateFrom=' + this.todayDay + '&dateTo=' + this.todayDay);

        this.todayButton = document.getElementById('today-button');
        this.weekButton = document.getElementById('week-button');
        this.monthButton = document.getElementById('month-button');
        this.yearButton = document.getElementById('year-button');
        this.allButton = document.getElementById('all-button');
        this.intervalButton = document.getElementById('interval-button');

        this.dateFrom = document.getElementById('date-from');
        this.dateTo = document.getElementById('date-to');

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

    }

    chart(arrayIncomeCategory, arrayIncomeAmount, arrayExpensesCategory, arrayExpensesAmount) {

         this.myLineChart = new Chart(this.ctx, {
            type: 'pie',
            data: {
                labels: arrayIncomeCategory,
                datasets: [{
                    label: '# of Votes',
                    data: arrayIncomeAmount,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },

        });

        this.myLineChart1 = new Chart(this.ctx1, {
            type: 'pie',
            data: {
                labels: arrayExpensesCategory,
                datasets: [{
                    label: '# of Votes',
                    data: arrayExpensesAmount,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            },
        });
    }

    async init(operation) {
        try {
            const result = await CustomHttp.request(config.hostOperations + operation);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                const allExpensesItem = result.filter(item => {
                    return item.type === 'expense';
                });

                const allExpensesItemCategory = allExpensesItem.map(item => {
                    return item.category;
                });

                const allExpensesItemAmount = allExpensesItem.map(item => {
                    return item.amount;
                });



                const allIncomeItem = result.filter(item => {
                    return item.type === 'income';
                });

                const allIncomeItemCategory = allIncomeItem.map(item => {
                    return item.category;
                });

                const allIncomeItemAmount = allIncomeItem.map(item => {
                    return item.amount;
                });

                this.chart(allIncomeItemCategory, allIncomeItemAmount, allExpensesItemCategory, allExpensesItemAmount);

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
            this.init('?period=interval&dateFrom=' + this.todayDay + '&dateTo=' + this.todayDay);
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

        if (nameOfButton === 'неделя') {
            this.init('?period=week');
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

        if (nameOfButton === 'месяц') {
            this.init('?period=month');
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }


        if (nameOfButton === 'год') {
            this.init('?period=year');
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

        if (nameOfButton === 'все') {
            this.init('?period=all');
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

        if (nameOfButton === 'интервал') {
            this.init('?period=interval&dateFrom='+ this.dateFrom.value + '&dateTo=' + this.dateTo.value);
            this.myLineChart.destroy();
            this.myLineChart1.destroy();
        }

    }

}
