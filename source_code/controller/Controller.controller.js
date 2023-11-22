// Helpers
const DownloaderGit = require("../helper/DownloaderGit.helper.js");
const CleanerFile = require("../helper/CleanerFile.helper.js");
const StaticAnalyzerCodeQL = require('../helper/StaticAnalyzerCodeQL.helper.js');
// Model
const StaticAnalysisRequestCodeQL = require('../model/StaticAnalysisRequestCodeQL.model.js');
// Errors
const BadFormat = require('../error/BadFormat.error.js');

/**
 * @overview This class represents the controller.
 */
class Controller {

    /**
     * Instantiates a controller.
     */
    constructor() {
        this.downloaderGit = new DownloaderGit();
        this.cleanerFile = new CleanerFile();
        this.staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        this.staticAnalysisRequestCodeQL = new StaticAnalysisRequestCodeQL();
    }

    /**
     * Cleans the all TEMP directory.
     * @returns {Promise} A promise for the cleaning.
     */
    clean(){
        return this.cleanerFile.cleanAll();
    }

    /**
     * Analyzes statically.
     * @param repositoryList {[String]} A list of repositories to analyze.
     * @returns {Promise} A promise for the analysis.
     */
    analyzeStatically(repositoryList) {
        return new Promise((resolve, reject) => {
            if (repositoryList !== undefined
                && repositoryList !== null
                && repositoryList.length !== 0) {
                try {
                    this.staticAnalysisRequestCodeQL.setRepositoryList(repositoryList);
                    this.downloaderGit.downloadByList(this.staticAnalysisRequestCodeQL.getRepositoryList()).then((result) => {
                        this.staticAnalysisRequestCodeQL.setDownloadedRepositoriesList(result);
                        this.staticAnalyzerCodeQL.prepareAnalysisByList(this.staticAnalysisRequestCodeQL.getDownloadedRepositoriesList()).then((result) => {
                            this.staticAnalysisRequestCodeQL.setPreparedRepositoriesList(result);
                            this.staticAnalyzerCodeQL.performAnalysisByList(this.staticAnalysisRequestCodeQL.getDownloadedRepositoriesList()).then((result) => {
                                this.staticAnalysisRequestCodeQL.setAnalyzedRepositoriesList(result);
                                this.staticAnalyzerCodeQL.extractAnalysisResultByList(this.staticAnalysisRequestCodeQL.getDownloadedRepositoriesList()).then((result) => {
                                    this.staticAnalysisRequestCodeQL.setExtractedResults(result);
                                    let finalResult = this.staticAnalyzerCodeQL.interpretAnalysisResult(this.staticAnalysisRequestCodeQL);
                                    this.clean().then(() => {
                                        delete finalResult.downloadedRepositoriesList;
                                        delete finalResult.preparedRepositoriesList;
                                        delete finalResult.analyzedRepositoriesList;
                                        delete finalResult.extractedResults;
                                        resolve(finalResult);
                                    });
                                }).catch(error => {
                                    this.clean().then(() => {
                                        reject(error);
                                    });
                                });
                            }).catch(error => {
                                this.clean().then(() => {
                                    reject(error);
                                });
                            });
                        }).catch(error => {
                            this.clean().then(() => {
                                reject(error);
                            });
                        });
                    }).catch(error => {
                        this.clean().then(() => {
                            reject(error);
                        });
                    });
                } catch (error) {
                    this.clean().then(() => {
                        reject(error);
                    });
                }
            } else {
                this.clean().then(() => {
                    reject(new BadFormat());
                });
            }
        });
    }
}

module.exports = Controller;