// Model
const StaticAnalysisRequestCodeQL = require('../../model/StaticAnalysisRequestCodeQL.model.js');
// Error
const BadFormat = require("../../error/BadFormat.error.js");

// Happy path test suite

describe('CodeQL static analysis request output', () => {

    test('does to string', () => {

        // Given

        let staticAnalysisRequestCodeQLAsObjectGiven = new StaticAnalysisRequestCodeQL();
        staticAnalysisRequestCodeQLAsObjectGiven.setRepositoryList(["https://github.com/A/A", "https://github.com/B/B"]);
        staticAnalysisRequestCodeQLAsObjectGiven.setDownloadedRepositoriesList(["A", "B"]);
        staticAnalysisRequestCodeQLAsObjectGiven.setPreparedRepositoriesList(["A", "B"]);
        staticAnalysisRequestCodeQLAsObjectGiven.setAnalyzedRepositoriesList(["A", "B"]);
        staticAnalysisRequestCodeQLAsObjectGiven.setExtractedResults([]);
        staticAnalysisRequestCodeQLAsObjectGiven.setInterpretedResults([]);

        // When

        let staticAnalysisRequestCodeQLAsStringGiven = staticAnalysisRequestCodeQLAsObjectGiven.toString();

        // Then

        expect(staticAnalysisRequestCodeQLAsStringGiven).toStrictEqual("{\"repositoryList\":[\"https://github.com/A/A\",\"https://github.com/B/B\"],\"downloadedRepositoriesList\":[\"A\",\"B\"],\"preparedRepositoriesList\":[\"A\",\"B\"],\"analyzedRepositoriesList\":[\"A\",\"B\"],\"extractedResults\":[],\"interpretedResults\":[]}");
    });

    test('revives as object', () => {

        // Given

        let staticAnalysisRequestCodeQLAsStringGiven = "{\"repositoryList\":[\"https://github.com/A/A\",\"https://github.com/B/B\"],\"downloadedRepositoriesList\":[\"A\",\"B\"],\"preparedRepositoriesList\":[\"A\",\"B\"],\"analyzedRepositoriesList\":[\"A\",\"B\"],\"extractedResults\":[],\"interpretedResults\":[]}";
        let staticAnalysisRequestCodeQLAsObjectGiven = JSON.parse(staticAnalysisRequestCodeQLAsStringGiven);

        // When

        let codeQLStaticAnalysisRequestAsModelGiven = StaticAnalysisRequestCodeQL.revive(staticAnalysisRequestCodeQLAsObjectGiven);

        // Then

        let staticAnalysisCodeQLRequestAsModelExpected = new StaticAnalysisRequestCodeQL();
        staticAnalysisCodeQLRequestAsModelExpected.setRepositoryList(["https://github.com/A/A", "https://github.com/B/B"]);
        staticAnalysisCodeQLRequestAsModelExpected.setDownloadedRepositoriesList(["A", "B"]);
        staticAnalysisCodeQLRequestAsModelExpected.setPreparedRepositoriesList(["A", "B"]);
        staticAnalysisCodeQLRequestAsModelExpected.setAnalyzedRepositoriesList(["A", "B"]);
        staticAnalysisCodeQLRequestAsModelExpected.setExtractedResults([]);
        staticAnalysisCodeQLRequestAsModelExpected.setInterpretedResults([]);
        expect(codeQLStaticAnalysisRequestAsModelGiven).toStrictEqual(staticAnalysisCodeQLRequestAsModelExpected);
    });
});


// Failure cases test suite

describe('CodeQL static analysis request output tries to', () => {


    test('revive an incorrect formatted object', () => {

        // Given

        let staticAnalysisRequestCodeQLAsStringGiven = "{\"repo\":\"hello\"}";

        // When Then

        expect(() => {
            StaticAnalysisRequestCodeQL.revive(staticAnalysisRequestCodeQLAsStringGiven)
        }).toThrow(new BadFormat());
    });

    test('revive an incomplete formatted object', () => {

        // Given

        let staticAnalysisRequestCodeQLAsStringGiven = "{\"repositoryList\":[\"https://github.com/A/A\",\"https://github.com/B/B\"]}";

        // When Then

        expect(() => {
            StaticAnalysisRequestCodeQL.revive(staticAnalysisRequestCodeQLAsStringGiven)
        }).toThrow(new BadFormat());
    });

    test('revives an undefined object', () => {

        // Given

        let staticAnalysisRequestCodeQLGiven = undefined;

        // When Then

        expect(() => {
            StaticAnalysisRequestCodeQL.revive(staticAnalysisRequestCodeQLGiven)
        }).toThrow(new BadFormat());
    });

    test('revives a null object', () => {

        // Given

        let staticAnalysisRequestCodeQLGiven = null;

        // When Then

        expect(() => {
            StaticAnalysisRequestCodeQL.revive(staticAnalysisRequestCodeQLGiven)
        }).toThrow(new BadFormat());
    });
});