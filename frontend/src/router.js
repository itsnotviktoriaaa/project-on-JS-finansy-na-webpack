import {Grafika} from "./components/grafika.js";
import {Registration} from "./components/registration.js";
import {Income} from "./components/income.js";
import {Expenses} from "./components/expenses.js";
import {CreateIncome} from "./components/createIncome.js";
import {CreateExpenses} from "./components/createExpenses.js";
import {Balance} from "./components/balance.js";
import {Auth} from "./services/Auth.js";
import {IncomeExpenses} from "./components/incomeExpenses.js";
import {ReloadManager} from "./utils/reload-manager.js";
import {CreateIncomeExpenses} from "./components/createIncomeExpenses.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('individual-css');
        this.stylesElement1 = document.getElementById('individual-css1');
        this.titleElement = document.getElementById('title');
        this.commonWrapper = document.getElementById('common-wrapper');
        this.commonBar = document.getElementById('common-bar');
        this.grafikaPage = document.getElementById('grafika');
        this.incomeExpensesPage = document.getElementById('income-expenses');
        this.categoryGroup = document.getElementById('category-group');
        this.categoryMainPage = document.getElementById('category-main');
        this.categoryIncomePage = document.getElementById('category-income');
        this.categoryExpensesPage = document.getElementById('category-expenses');
        this.fullNameUser = document.getElementById('full-name-user');
        this.routes = [
            {
                route: '#/',
                title: 'Авторизация',
                template: 'templates/index.html',
                styles: '',
                load: () => {
                    new Registration('');
                }
            },
            {
                route: '#/registration',
                title: 'Регистрация',
                template: 'templates/registration.html',
                styles: '',
                load: () => {
                    new Registration('registration');
                }
            },
            {
                route: '#/income',
                title: 'Категории доходов',
                template: 'templates/income.html',
                styles: '',
                load: () => {
                    new Income();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/createIncome',
                title: 'Создать категорию доходов',
                template: 'templates/createIncome.html',
                styles: '',
                load: () => {
                    new CreateIncome();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/editIncome',
                title: 'Редактировать категорию доходов',
                template: 'templates/editIncome.html',
                styles: '',
                load: () => {
                }
            },
            {
                route: '#/expenses',
                title: 'Категории расходов',
                template: 'templates/expenses.html',
                styles: 'css/expenses.css',
                load: () => {
                    new Expenses();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/createExpenses',
                title: 'Создать категорию расходов',
                template: 'templates/createExpenses.html',
                styles: '',
                load: () => {
                    new CreateExpenses();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/editExpenses',
                title: 'Редактировать категорию расходов',
                template: 'templates/editExpenses.html',
                styles: '',
                load: () => {
                }
            },
            {
                route: '#/incomeExpenses',
                title: 'Доходы и расходы',
                template: 'templates/incomeExpenses.html',
                styles: 'css/incomeExpenses.css',
                load: () => {
                    new IncomeExpenses();
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/createIncomeExpenses',
                title: 'Создание дохода/расхода',
                template: 'templates/createIncomeExpenses.html',
                styles: 'css/createIncomeExpenses.css',
                load: () => {
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/editIncomeExpenses',
                title: 'Редактирование дохода/расхода',
                template: 'templates/editIncomeExpenses.html',
                styles: 'css/editIncomeExpenses.css',
                load: () => {
                    ReloadManager.checkReloadPage();
                }
            },
            {
                route: '#/grafika',
                title: 'Главная',
                template: 'templates/grafika.html',
                styles: 'css/grafika.css',
                styles1: 'css/incomeExpenses.css',
                load: () => {
                    new Balance();
                    new Grafika();
                }
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];

        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());

        this.stylesElement.setAttribute('href', '');
        this.stylesElement1.setAttribute('href', '');

        if (newRoute.styles) {
            this.stylesElement.setAttribute('href', newRoute.styles);
        }

        this.titleElement.innerText = newRoute.title;

        this.commonWrapper.className = '';
        this.commonBar.className = 'd-none flex-column flex-shrink-0 py-3 bg-light';


        if (newRoute.route !== '#/' && newRoute.route !== '#/registration') {
            this.commonWrapper.className = 'd-flex flex-nowrap main';
            this.commonBar.className = 'd-flex flex-column flex-shrink-0 py-3 bg-light';
        }

        if (newRoute.styles1) {
            this.stylesElement1.setAttribute('href', newRoute.styles1);
        }

        this.contentElement.className = '';

        if (newRoute.route === '#/grafika' || newRoute.route === '#/incomeExpenses') {
            this.contentElement.className = 'w-100';
        }

        this.grafikaPage.className = 'nav-link link-dark';
        this.incomeExpensesPage.className = 'nav-link link-dark';
        this.categoryGroup.className = 'category-border-white collapse';
        this.categoryMainPage.className = 'nav-link link-dark';
        this.categoryIncomePage.className = 'nav-link link-dark';
        this.categoryExpensesPage.className = 'nav-link link-dark';

        if (newRoute.route === '#/grafika') {
            this.grafikaPage.className = 'nav-link active';
        }

        if (newRoute.route === '#/incomeExpenses' || newRoute.route === '#/createIncomeExpenses' || newRoute.route === '#/editIncomeExpenses') {
            this.incomeExpensesPage.className = 'nav-link active';
        }

        if (newRoute.route === '#/income' || newRoute.route === '#/editIncome' || newRoute.route === '#/createIncome') {
            this.categoryGroup.className = 'category-border-blue collapse show';
            this.categoryMainPage.className = 'nav-link active';
            this.categoryIncomePage.className = 'nav-link active-color';
        }

        if (newRoute.route === '#/expenses' || newRoute.route === '#/editExpenses' || newRoute.route === '#/createExpenses') {
            this.categoryGroup.className = 'category-border-blue collapse show';
            this.categoryMainPage.className = 'nav-link active';
            this.categoryExpensesPage.className = 'nav-link active-color';
        }

        if (newRoute.route !== '#/' && newRoute.route !== '#/registration') {

            const userInfo = Auth.getUserInfo();
            if (!userInfo) {
                location.href = '#/';
                return;
            }

            const userInfoName = userInfo.name;
            const userInfoLastName = userInfo.lastName;

            this.fullNameUser.innerText = userInfoName + ' ' + userInfoLastName;
        }

        if (newRoute.route === '#/editIncomeExpenses') {
            if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
                const error = document.getElementById('error');
                error.className = 'd-block text-danger mb-2'
                error.innerText = 'Вам необходимо нажать на кнопку "Отмена" и зайти снова, поскольку Вы перезагрузили страницу';

                const editIncomeExpensesItem = document.getElementById('edit-income-expenses-item');
                editIncomeExpensesItem.className = 'btn btn-success disabled';
                editIncomeExpensesItem.setAttribute('title', '');
            }
        }

        if (newRoute.route === '#/createIncomeExpenses') {
            if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
                new CreateIncomeExpenses();
            }
        }

        newRoute.load();

    }

}