export class DateManager {
    constructor() {
        this.todayDate = new Date();
        this.todayDateDay = this.todayDate.getDate();
        this.todayDateMonth = this.todayDate.getMonth();
        this.todayDateYear = this.todayDate.getFullYear();
    }

    init() {
        this.todayNewDate = this.todayDateYear + '-' + ("0" + (this.todayDateMonth + 1)).slice(-2) + '-' + ("0" + this.todayDateDay).slice(-2);
        return this.todayNewDate;
    }

}