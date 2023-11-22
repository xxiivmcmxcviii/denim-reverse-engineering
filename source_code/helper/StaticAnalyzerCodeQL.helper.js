// Constants
const {FILE_SYSTEM_SEPARATOR} = require("./Constant.helper.js");
// Error
const BadFormat = require("../error/BadFormat.error.js");
const AnalysisFail = require("../error/AnalysisFail.error.js");
// Helpers
const StaticAnalyzer = require("./StaticAnalyzer.helper.js");
// Libraries
const {exec} = require("node:child_process");
const fs = require("fs");
const readline = require("readline");

/**
 * @overview This class represents the CodeQL static analyzer.
 */
class StaticAnalyzerCodeQL extends StaticAnalyzer {

    /**
     * Instantiates a CodeQL static analyzer.
     */
    constructor() {
        super();
    }

    /**
     * Prepares an analysis by list.
     * @param list {[String]} The given list.
     * @returns {Promise} A promise for the preparation.
     */
    prepareAnalysisByList(list) {
        return new Promise((resolveAll, rejectAll) => {
            if (list !== undefined && list !== null && list.length !== 0) {
                let promises = [];
                list.forEach(element => {
                    promises.push(new Promise((resolve, reject) => {
                        this.prepareAnalysisByElement(element).then(result => {
                            resolve(result);
                        }).catch(error => {
                            reject(new AnalysisFail(error.message));
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
     * Prepares an analysis by element.
     * @param element {String} The given element.
     * @returns {Promise} A promise for the preparation.
     */
    prepareAnalysisByElement(element) {
        return new Promise((resolve, reject) => {
            if (element !== undefined && element !== null && element.length !== 0) {
                let repositoryFolder = process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + element;
                let codeQLRepositoryFolder = process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + element + "-codeql";

                try {
                    // 1. Database preparation
                    exec("." + FILE_SYSTEM_SEPARATOR + "lib" + FILE_SYSTEM_SEPARATOR + "codeql-cli" + FILE_SYSTEM_SEPARATOR + "codeql database create --language=javascript --source-root" + " " + repositoryFolder + " " + codeQLRepositoryFolder, {maxBuffer: 1024 * 1000 * 500}, (error, stdout, stderr) => {
                        if (error) {
                            reject(new AnalysisFail(error.message));
                        } else {
                            try {
                                // 2. Query preparation
                                fs.mkdirSync(codeQLRepositoryFolder + FILE_SYSTEM_SEPARATOR + "query");
                                fs.cpSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "query", codeQLRepositoryFolder + FILE_SYSTEM_SEPARATOR + "query", {
                                    recursive: true,
                                })

                                // 3. Result preparation
                                fs.mkdirSync(codeQLRepositoryFolder + FILE_SYSTEM_SEPARATOR + "result");

                                resolve(element + "-codeql");
                            } catch (error) {
                                reject(new AnalysisFail(error.message));
                            }
                        }
                    });
                } catch (error) {
                    reject(new AnalysisFail(error.message));
                }
            } else {
                reject(new BadFormat());
            }
        });
    }

    /**
     * Performs an analysis by list.
     * @param list {[String]} The given list.
     * @returns {Promise} A promise for the analysis.
     */
    performAnalysisByList(list) {
        return new Promise((resolveAll, rejectAll) => {
            if (list !== undefined && list !== null && list.length !== 0) {
                let promises = [];
                list.forEach(element => {
                    promises.push(new Promise((resolve, reject) => {
                        this.performAnalysisByElement(element).then(result => {
                            resolve(result);
                        }).catch(error => {
                            reject(new AnalysisFail(error.message));
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
     * Performs an analysis by element.
     * @param element {String} The given element.
     * @returns {Promise} A promise for the analysis.
     */
    performAnalysisByElement(element) {
        return new Promise((resolve, reject) => {
            if (element !== undefined && element !== null && element.length !== 0) {
                let codeQLRepositoryFolder = process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + element + "-codeql";
                let codeQLRepositoryQueryFolder = codeQLRepositoryFolder + FILE_SYSTEM_SEPARATOR + "query";
                let codeQLRepositoryResultFile = codeQLRepositoryFolder + FILE_SYSTEM_SEPARATOR + "result" + FILE_SYSTEM_SEPARATOR + "result.csv";
                try {
                    exec("." + FILE_SYSTEM_SEPARATOR + "lib" + FILE_SYSTEM_SEPARATOR + "codeql-cli" + FILE_SYSTEM_SEPARATOR + "codeql database analyze " + codeQLRepositoryFolder + " " + codeQLRepositoryQueryFolder + " --format=csv --rerun --output=" + codeQLRepositoryResultFile, [], (error, stdout, stderr) => {
                        if (error) {
                            reject(new AnalysisFail(error.message));
                        } else {
                            resolve(element + "-codeql");
                        }
                    });
                } catch (error) {
                    reject(new AnalysisFail(error.message));
                }
            } else {
                reject(new BadFormat());
            }
        });
    }

    /**
     * Extracts the results of an analysis by list.
     * @param list {[String]} The given list.
     * @returns {Promise} A promise for the extraction.
     */
    extractAnalysisResultByList(list) {
        return new Promise((resolveAll, rejectAll) => {
            if (list !== undefined && list !== null && list.length !== 0) {
                let promises = [];
                list.forEach(element => {
                    promises.push(new Promise((resolve, reject) => {
                        this.extractAnalysisResultByElement(element).then(result => {
                            resolve(result);
                        }).catch(error => {
                            reject(error);
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
     * Extracts the results of an analysis by element.
     * @param element {String} The given element.
     * @returns {Promise} A promise for the extraction.
     */
    extractAnalysisResultByElement(element) {
        return new Promise((resolve, reject) => {
            if (element !== undefined && element !== null && element.length !== 0) {
                if (fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + element)) {
                    try {
                        let codeQLRepositoryFolder = process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + element + "-codeql"
                        let codeQLRepositoryResultFile = codeQLRepositoryFolder + FILE_SYSTEM_SEPARATOR + "result" + FILE_SYSTEM_SEPARATOR + "result.csv";
                        let result = [];
                        const stream = fs.createReadStream(codeQLRepositoryResultFile);
                        const readLineInterface = readline.createInterface({input: stream});
                        readLineInterface.on("line", (row) => {
                            result.push(row);
                        });
                        readLineInterface.on("close", () => {
                            resolve(result);
                        });
                    } catch (error) {
                        reject(new AnalysisFail(error));
                    }
                } else {
                    reject(new AnalysisFail());
                }
            } else {
                reject(new BadFormat());
            }
        });
    }

    /**
     * Interprets the results of an analysis.
     * @param object {Object} The given object representing the analysis result.
     * @returns {Object} The result of the interpretation.
     */
    interpretAnalysisResult(object) {
        let repositoriesResult = [];
        for (let i = 0; i < object.getExtractedResults().length; i++) {
            let repositoryUrl = object.getRepositoryList()[i].replace('.git', '/blob/main');
            let repositoryResult = [];
            for (let j = 0; j < object.getExtractedResults()[i].length; j++) {
                let repositoryResultLine = [];
                let codeDetection = object.getExtractedResults()[i][j].slice(1, -1);
                // the last one
                codeDetection = codeDetection.replaceAll('"', '');
                codeDetection = codeDetection.split(",");
                repositoryResultLine.push(codeDetection[0]); // Type
                repositoryResultLine.push(repositoryUrl + codeDetection[4] + "#L" + codeDetection[5]); // Link
                repositoryResultLine.push(codeDetection[3]); // Details
                repositoryResult.push(repositoryResultLine);
            }
            repositoriesResult.push(repositoryResult);
        }
        object.setInterpretedResults(repositoriesResult);
        return object;
    }
}

module.exports = StaticAnalyzerCodeQL;