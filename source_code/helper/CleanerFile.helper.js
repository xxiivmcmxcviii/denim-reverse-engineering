// Constants
const {FILE_SYSTEM_SEPARATOR} = require("./Constant.helper.js");
// Errors
const BadFormat = require("../error/BadFormat.error.js");
const CleaningFail = require("../error/CleaningFail.error.js");
// Helpers
const Cleaner = require("./Cleaner.helper.js");
// Libraries
const fs = require("fs");
const path = require("path");

/**
 * @overview This class represents a file cleaner.
 */
class CleanerFile extends Cleaner {

    /**
     * Instantiates a cleaner.
     */
    constructor() {
        super();
    }

    /**
     * Cleans a list.
     * @param list {[String]} The given list.
     * @returns {Promise} A promise for the cleaning.
     */
    cleanByList(list) {
        return new Promise((resolveAll, rejectAll) => {
            if (list !== undefined
                && list !== null) {
                let promises = [];
                list.forEach(element => {
                    promises.push(new Promise((resolve, reject) => {
                        this.cleanByElement(element).then(result => {
                            resolve(result);
                        }).catch(error => {
                            reject(new CleaningFail(error.message));
                        });
                    }));
                });
                Promise.all(promises).then(resultsAll => {
                    resolveAll(resultsAll);
                }).catch(errorAll => {
                    rejectAll(errorAll);
                });
            } else {
                rejectAll(new BadFormat());
            }
        });
    }

    /**
     * Cleans an element.
     * @param element {String} The given element.
     * @returns {Promise} A promise for the cleaning.
     */
    cleanByElement(element) {
        return new Promise((resolve, reject) => {
            if (element !== undefined
                && element !== null
                && element.length !== 0) {
                if (fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + element)) {
                    fs.rmdirSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + element, {recursive: true});
                    resolve(true);
                } else {
                    reject(new CleaningFail());
                }
            } else {
                reject(new BadFormat());
            }
        });
    }

    /**
     * Deletes all the files in the TEMP directory.
     */
    cleanAll(){
        return new Promise((resolve, reject) => {
            let tempDirectory = process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP";
            for (const file of fs.readdirSync(tempDirectory)) {
                fs.rmdirSync(path.join(tempDirectory, file),{recursive: true});
            }
            resolve(true);
        });
    }
}

module.exports = CleanerFile;