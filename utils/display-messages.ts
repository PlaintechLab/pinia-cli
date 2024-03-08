import chalk from "chalk";
import {
    ERROR_MESSAGES_PREFIX,
    SUCCESS_MESSAGES_PREFIX,
} from "../common/constants";

export const displayErrorMessage = (message: string) => {
    const errorMsg = chalk.red(
        `${chalk.bgRed(ERROR_MESSAGES_PREFIX)} ${message}`
    );
    console.log();
    console.log(errorMsg);
};

export const displaySuccessMessage = (message: string) => {
    const successMsg = chalk.green(
        `${chalk.bgGreen(SUCCESS_MESSAGES_PREFIX)} ${message}`
    );
    console.log();
    console.log(successMsg);
};
