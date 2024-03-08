import * as fs from "fs";
import { displaySuccessMessage } from "./display-messages";

/**
 * Creates a directory at the specified filepath if it doesn't already exist.
 * @param filepath - The path of the directory to create.
 */
export const createDirectory = (filepath: string) => {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, { recursive: true });
        displaySuccessMessage(`Directory created at ${filepath}`);
    }
};
