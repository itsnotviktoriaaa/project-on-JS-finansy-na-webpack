import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Balance {
    constructor() {
        this.balanceAmount = document.getElementById('balance-amount');

        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.hostBalance);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }

                this.balanceAmount.innerText = result.balance + '$';

            }
        } catch (error) {
            console.log(error);
        }
    }

}
