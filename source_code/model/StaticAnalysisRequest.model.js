// Error
const BadFormat = require("../error/BadFormat.error.js");

/**
 * @overview This class represents a static analysis request.
 */
class StaticAnalysisRequest {

    /**
     * Instantiates a static analysis request.
     */
    constructor() {
    }

    /**
     * Revives a StaticAnalysisRequest object as a JavaScript StaticAnalysisRequest object.
     * @param object {Object} The given JavaScript object.
     * @return {StaticAnalysisRequest} The related static analysis request object.
     * @throws {Error} In the case of an invalid object format.
     */
    static revive(object) {
        try {
            if (object !== null
                && object !== undefined) {
                return new StaticAnalysisRequest();
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

module.exports = StaticAnalysisRequest;