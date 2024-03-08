import * as fs from "fs";
import { createDirectory, displayErrorMessage, displaySuccessMessage } from ".";

type StoreType = "option" | "setup";

/**
 * Creates a Pinia store with the given name in the specified directory.
 * @param store - The name of the store to create.
 * @param directory - The directory where the store should be created. Defaults to "stores".
 * @param type - The type of the store. Defaults to "option".
 */
export const createStore = (
    store: string,
    directory = "stores",
    type = "option" as StoreType
) => {
    //* Check if user use Vue 3 or Nuxt

    if (!isUseVue3OrNuxt3()) {
        return;
    }

    if (store.includes("index")) {
        displayErrorMessage("Store name cannot be index");
        return;
    }

    //* Split directory if it has a slash
    if (directory.includes("/")) {
        const split = directory.split("/");
        directory = split[split.length - 1];
    }

    const isUseNuxt3 = fs.existsSync("node_modules/nuxt");

    isUseNuxt3
        ? displaySuccessMessage("Nuxt 3 detected")
        : displaySuccessMessage("Vue 3 detected");

    directory = isUseNuxt3 ? "stores" : `src/${directory}`;

    if (!fs.existsSync(directory)) {
        createDirectory(directory);
    }

    const isGotDot = store.includes(".");
    if (isGotDot) {
        displayErrorMessage("Store name cannot contain a dot");
        return;
    }

    if (fs.existsSync(`${directory}/${store}.ts`)) {
        displayErrorMessage(
            `Store with name ${store} already exists in the directory ${directory}`
        );
        return;
    }

    //* Check if index.ts exists
    if (fs.existsSync(`${directory}/index.ts`)) {
        const data = fs.readFileSync(`${directory}/index.ts`, "utf8");
        const lines = data.split("\n");
        const lastLine = lines[lines.length - 1];
        if (lastLine === "") {
            lines.pop();
        }
        lines.push(`export * from "./${store}";`);
        fs.writeFileSync(`${directory}/index.ts`, lines.join("\n"));
    } else {
        fs.writeFileSync(
            `${directory}/index.ts`,
            `export * from "./${store}";\n`
        );
    }

    const storeName = store.charAt(0).toUpperCase() + store.slice(1);

    fs.writeFileSync(
        `${directory}/${store}.ts`,
        generateStoreContext({ store, storeName, type })
    );

    displaySuccessMessage(
        `Store with name ${store} has been created successfully in the directory ${directory}`
    );
};

/**
 * Checks if the project is using Vue 3 or Nuxt.
 * @returns {boolean} Returns true if the project is using Vue 3 or Nuxt, otherwise false.
 */
const isUseVue3OrNuxt3 = (): boolean => {
    const isVue3 = fs.existsSync("node_modules/vue");
    const isNuxt = fs.existsSync("node_modules/nuxt");

    if (!isVue3 && !isNuxt) {
        displayErrorMessage(
            "Please make sure you are in a Vue 3 or Nuxt project"
        );
        return false;
    }
    return true;
};

/**
 * Generates the store context based on the provided parameters.
 *
 * @param {Object} options - The options for generating the store context.
 * @param {string} options.store - The store name.
 * @param {string} options.storeName - The name of the store.
 * @param {StoreType} options.type - The type of the store.
 * @returns {string} The generated store context.
 */
const generateStoreContext = ({
    store,
    storeName,
    type,
}: {
    store: string;
    storeName: string;
    type: StoreType;
}) => {
    switch (type) {
        case "option":
            return `import { defineStore } from "pinia";\n\nexport const use${storeName}Store = defineStore("${store}", {\n    state: () => ({}),\n    getters: {},\n    actions: {},\n});`;
        case "setup":
            return `import { defineStore } from "pinia";\n\nexport const use${storeName}Store = defineStore("${store}", () => {\n\n    return {}  \n});`;
    }
};
