// Model
const StaticAnalysisRequest = require("./StaticAnalysisRequest.model.js");
// Error
const BadFormat = require("../error/BadFormat.error.js");

/**
 * @overview This class represents a CodeQL static analysis request output.
 */
class StaticAnalysisRequestCodeQL extends StaticAnalysisRequest {

    /**
     * Instantiates a static analysis request.
     */
    constructor() {
        super();
        this.repositoryList = [];
        this.downloadedRepositoriesList = [];
        this.preparedRepositoriesList = [];
        this.analyzedRepositoriesList = [];
        this.extractedResults = [];
        this.interpretedResults = [];
    }

    setRepositoryList(repositoryList) {
        this.repositoryList = repositoryList;
    }

    getRepositoryList() {
        return this.repositoryList;
    }

    setDownloadedRepositoriesList(downloadedRepositoriesList) {
        this.downloadedRepositoriesList = downloadedRepositoriesList;
    }

    getDownloadedRepositoriesList() {
        return this.downloadedRepositoriesList;
    }

    setPreparedRepositoriesList(preparedRepositoriesList) {
        this.preparedRepositoriesList = preparedRepositoriesList;
    }

    getPreparedRepositoriesList() {
        return this.preparedRepositoriesList;
    }

    setAnalyzedRepositoriesList(analyzedRepositoriesList) {
        this.analyzedRepositoriesList = analyzedRepositoriesList;
    }

    getAnalyzedRepositoriesList() {
        return this.analyzedRepositoriesList;
    }

    setExtractedResults(extractedResults) {
        this.extractedResults = extractedResults;
    }

    getExtractedResults() {
        return this.extractedResults;
    }

    setInterpretedResults(interpretedResults) {
        this.interpretedResults = interpretedResults;
    }

    getInterpretedResults() {
        return this.interpretedResults;
    }

    /**
     * Revives a StaticAnalysisRequestCodeQL object as a JavaScript StaticAnalysisRequestCodeQL object.
     * @param object {Object} The given JavaScript object.
     * @return {StaticAnalysisRequestCodeQL} The related static analysis request output object.
     * @throws {Error} In the case of an invalid object format.
     */
    static revive(object) {
        try {
            if (object !== null && object !== undefined
                && object.hasOwnProperty("repositoryList") && object.repositoryList !== null && object.repositoryList !== undefined
                && object.hasOwnProperty("downloadedRepositoriesList") && object.downloadedRepositoriesList !== null && object.downloadedRepositoriesList !== undefined
                && object.hasOwnProperty("preparedRepositoriesList") && object.preparedRepositoriesList !== null && object.preparedRepositoriesList !== undefined
                && object.hasOwnProperty("analyzedRepositoriesList") && object.analyzedRepositoriesList !== null && object.analyzedRepositoriesList !== undefined
                && object.hasOwnProperty("extractedResults") && object.extractedResults !== null && object.extractedResults !== undefined
                && object.hasOwnProperty("interpretedResults") && object.interpretedResults !== null && object.interpretedResults !== undefined) {
                let staticAnalysisRequest = new StaticAnalysisRequestCodeQL();
                staticAnalysisRequest.setRepositoryList(object.repositoryList);
                staticAnalysisRequest.setDownloadedRepositoriesList(object.downloadedRepositoriesList);
                staticAnalysisRequest.setPreparedRepositoriesList(object.downloadedRepositoriesList);
                staticAnalysisRequest.setAnalyzedRepositoriesList(object.analyzedRepositoriesList);
                staticAnalysisRequest.setExtractedResults(object.extractedResults);
                staticAnalysisRequest.setInterpretedResults(object.interpretedResults);
                return staticAnalysisRequest;
            } else {
                throw new BadFormat();
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Prints the object in a human-readable way (JSON).
     */
    toString() {
        return JSON.stringify(this);
    }

}

module.exports = StaticAnalysisRequestCodeQL;