// Constants
const {FILE_SYSTEM_SEPARATOR} = require("./Constant.helper.js");
// Errors
const DownloadFail = require("../error/DownloadFail.error.js");
const BadFormat = require("../error/BadFormat.error.js");
// Helpers
const Downloader = require("./Downloader.helper.js");
// Libraries
const {exec} = require("node:child_process");

/**
 * @overview This class represents a downloader.
 */
class DownloaderGit extends Downloader {

    /**
     * Instantiates a downloader.
     */
    constructor() {
        super();
    }

    /**
     * Downloads a list.
     * @param list {[String]} The given list.
     * @returns {Promise} A promise for the downloading.
     */
    downloadByList(list) {
        return new Promise((resolveAll, rejectAll) => {
            if (list !== undefined
                && list !== null
                && list.length !== 0) {
                let promises = [];
                list.forEach(element => {
                    promises.push(new Promise((resolve, reject) => {
                        this.downloadByElement(element).then(result => {
                            resolve(result);
                        }).catch(error => {
                            reject(new DownloadFail(error.message));
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
     * Downloads an element.
     * @param element {String} The given element.
     * @returns {Promise} A promise for the downloading.
     */
    downloadByElement(element) {
        return new Promise((resolve, reject) => {
            if (element !== undefined
                && element !== null
                && element.length !== 0) {
                exec("git -C " + process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR
                    + " -c credential.helper=" // For skipping credential prompt.
                    + " -c core.longpaths=true" // For authorizing long path.
                    + " clone " + element
                    + " --depth 1", // For downloading only the last version and not all the history repository
                    [], (error, stdout, stderr) => {
                    if (error) {
                        reject(new DownloadFail(error.message));
                    } else {
                        let createdFolder = element.substring(element.lastIndexOf("/") + 1, element.lastIndexOf(".git"));
                        resolve(createdFolder);
                    }
                });
            } else {
                reject(new BadFormat());
            }
        });
    }
}

module.exports = DownloaderGit;