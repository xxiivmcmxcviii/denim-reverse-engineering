// Helpers
const StaticAnalyzerCodeQL = require('../../helper/StaticAnalyzerCodeQL.helper.js');
//Constants
const {FILE_SYSTEM_SEPARATOR} = require("../../helper/Constant.helper");
//Libraries
const fs = require('fs');
// Errors
const AnalysisFail = require("../../error/AnalysisFail.error.js");
const BadFormat = require("../../error/BadFormat.error.js");

// Setup

const repositoryList = ["raindrop-microservice-application-example-api-minimal", "raindrop-microservice-application-example-api-minimal-codeql", "unknown-codeql"];

async function clean() {
    // Cleaning.

    for (let i = 0; i < repositoryList.length; i++) {
        if (fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[i])) {
            await fs.rmdirSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[i], {recursive: true});
        }
    }
}

// Happy path test suite

describe('CodeQL static analyzer', () => {

    beforeEach(() => {
        // Preparing.
        fs.mkdirSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0]);
        fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "test" + FILE_SYSTEM_SEPARATOR + "unit" + FILE_SYSTEM_SEPARATOR + "asset" + FILE_SYSTEM_SEPARATOR + "index.example.js", process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + FILE_SYSTEM_SEPARATOR + "index.js");
    });

    afterEach(async () => {
        await clean();
    });

    it('prepares a CodeQL static analysis by repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then
        await staticAnalyzerCodeQL.prepareAnalysisByElement(repositoryList[0]).then((result) => {
            const repositoryGenerated1 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql');
            const repositoryGenerated2 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql' + FILE_SYSTEM_SEPARATOR + 'query');
            const repositoryGenerated3 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql' + FILE_SYSTEM_SEPARATOR + 'query' + FILE_SYSTEM_SEPARATOR + 'qlpack.yml');
            const repositoryGenerated4 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql' + FILE_SYSTEM_SEPARATOR + 'result');
            expect(repositoryGenerated1 && repositoryGenerated2 && repositoryGenerated3 && repositoryGenerated4).toBe(true);
        });
    });

    it('prepares a CodeQL static analysis by repository list', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await staticAnalyzerCodeQL.prepareAnalysisByList([repositoryList[0]]).then((result) => {
            const repositoryGenerated1 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql');
            const repositoryGenerated2 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql' + FILE_SYSTEM_SEPARATOR + 'query');
            const repositoryGenerated3 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql' + FILE_SYSTEM_SEPARATOR + 'query' + FILE_SYSTEM_SEPARATOR + 'qlpack.yml');
            const repositoryGenerated4 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql' + FILE_SYSTEM_SEPARATOR + 'result');
            expect(repositoryGenerated1
                && repositoryGenerated2
                && repositoryGenerated3
                && repositoryGenerated4).toBe(true);
        });
    });

    it('performs a CodeQL static analysis by repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then
        await staticAnalyzerCodeQL.prepareAnalysisByElement(repositoryList[0]).then(async (result) => {
            await staticAnalyzerCodeQL.performAnalysisByElement(repositoryList[0]).then((result) => {
                const repositoryGenerated1 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql' + FILE_SYSTEM_SEPARATOR + 'result' + FILE_SYSTEM_SEPARATOR + 'result.csv');
                expect(repositoryGenerated1).toBe(true);
            });
        });
    });

    it('performs a CodeQL static analysis by repository list', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then
        await staticAnalyzerCodeQL.prepareAnalysisByList([repositoryList[0]]).then(async (result) => {
            await staticAnalyzerCodeQL.performAnalysisByList([repositoryList[0]]).then((result) => {
                const repositoryGenerated1 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + repositoryList[0] + '-codeql' + FILE_SYSTEM_SEPARATOR + 'result' + FILE_SYSTEM_SEPARATOR + 'result.csv');
                expect(repositoryGenerated1).toBe(true);
            });
        });
    });

    it('extracts a CodeQL static analysis result by repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then
        await staticAnalyzerCodeQL.prepareAnalysisByElement(repositoryList[0]).then(async (result) => {
            await staticAnalyzerCodeQL.performAnalysisByElement(repositoryList[0]).then(async (result) => {
                await staticAnalyzerCodeQL.extractAnalysisResultByElement(repositoryList[0]).then((result) => {
                    expect(Array.isArray(result) && result.length > 0 ).toBe(true)
                });
            });
        });
    });

    it('extracts a CodeQL static analysis result by repository list', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then
        await staticAnalyzerCodeQL.prepareAnalysisByList([repositoryList[0]]).then(async (result) => {
            await staticAnalyzerCodeQL.performAnalysisByList([repositoryList[0]]).then(async (result) => {
                await staticAnalyzerCodeQL.extractAnalysisResultByList([repositoryList[0]]).then((result) => {
                    expect(Array.isArray(result) && result.length > 0 ).toBe(true)
                });
            });
        });
    });

    // TODO : Test for StaticAnalyzerCodeQL::interpretAnalysisResult
});

// Failure cases test suite

describe('CodeQL static analyzer tries to', () => {

    afterEach(async () => {
        await clean();
    });

    it('prepare a CodeQL static analysis by not found repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        let repository = "unknown";

        // When Then

        await expect(staticAnalyzerCodeQL.prepareAnalysisByElement(repository)).rejects.toThrow(AnalysisFail);
    });

    it('prepare a CodeQL static analysis by undefined repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        let repository = undefined;

        // When Then

        await expect(staticAnalyzerCodeQL.prepareAnalysisByElement(repository)).rejects.toThrow(BadFormat);

    });

    it('prepare a CodeQL static analysis by null repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        let repository = null;

        // When Then

        await expect(staticAnalyzerCodeQL.prepareAnalysisByElement(repository)).rejects.toThrow(BadFormat);

    });

    it('prepare a CodeQL static analysis by repository list with not found repositories', async () => {

        // Given

        let repositoryList = ["unknown"];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.prepareAnalysisByList(repositoryList)).rejects.toThrow(AnalysisFail);
    });

    it('prepare a CodeQL static analysis by undefined repository list', async () => {

        // Given

        let repositoryList = undefined;
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.prepareAnalysisByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('prepare a CodeQL static analysis by null repository list', async () => {

        // Given

        let repositoryList = null;
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.prepareAnalysisByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('prepare a CodeQL static analysis by repository list with undefined repositories', async () => {

        // Given

        let repositoryList = [undefined];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.prepareAnalysisByList(repositoryList)).rejects.toThrow(AnalysisFail);
    });

    it('prepare a CodeQL static analysis by repository list with null repositories', async () => {

        // Given

        let repositoryList = [null];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.prepareAnalysisByList(repositoryList)).rejects.toThrow(AnalysisFail);
    });

    it('prepare a CodeQL static analysis by empty repository list', async () => {

        // Given

        let repositoryList = [];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.prepareAnalysisByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('perform a CodeQL static analysis by not found repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        let repository = "unknown";

        // When Then

        await expect(staticAnalyzerCodeQL.performAnalysisByElement(repository)).rejects.toThrow(AnalysisFail);
    });

    it('perform a CodeQL static analysis by undefined repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        let repository = undefined;

        // When Then

        await expect(staticAnalyzerCodeQL.performAnalysisByElement(repository)).rejects.toThrow(BadFormat);

    });

    it('perform a CodeQL static analysis by null repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        let repository = null;

        // When Then

        await expect(staticAnalyzerCodeQL.performAnalysisByElement(repository)).rejects.toThrow(BadFormat);

    });

    it('perform a CodeQL static analysis by repository list with not found repositories', async () => {

        // Given

        let repositoryList = ["unknown"];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.performAnalysisByList(repositoryList)).rejects.toThrow(AnalysisFail);
    });

    it('perform a CodeQL static analysis by undefined repository list', async () => {

        // Given

        let repositoryList = undefined;
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.performAnalysisByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('perform a CodeQL static analysis by null repository list', async () => {

        // Given

        let repositoryList = null;
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.performAnalysisByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('perform a CodeQL static analysis by repository list with undefined repositories', async () => {

        // Given

        let repositoryList = [undefined];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.performAnalysisByList(repositoryList)).rejects.toThrow(AnalysisFail);
    });

    it('perform a CodeQL static analysis by repository list with null repositories', async () => {

        // Given

        let repositoryList = [null];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.performAnalysisByList(repositoryList)).rejects.toThrow(AnalysisFail);
    });

    it('perform a CodeQL static analysis by empty repository list', async () => {

        // Given

        let repositoryList = [];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.performAnalysisByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('extract a CodeQL static analysis by not found repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        let repository = "unknown";

        // When Then

        await expect(staticAnalyzerCodeQL.extractAnalysisResultByElement(repository)).rejects.toThrow(AnalysisFail);
    });

    it('extract a CodeQL static analysis by undefined repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        let repository = undefined;

        // When Then

        await expect(staticAnalyzerCodeQL.extractAnalysisResultByElement(repository)).rejects.toThrow(BadFormat);

    });

    it('extract a CodeQL static analysis by null repository', async () => {

        // Given

        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();
        let repository = null;

        // When Then

        await expect(staticAnalyzerCodeQL.extractAnalysisResultByElement(repository)).rejects.toThrow(BadFormat);

    });

    it('extract a CodeQL static analysis by repository list with not found repositories', async () => {

        // Given

        let repositoryList = ["unknown"];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.extractAnalysisResultByList(repositoryList)).rejects.toThrow(AnalysisFail);
    });

    it('extract a CodeQL static analysis by undefined repository list', async () => {

        // Given

        let repositoryList = undefined;
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.extractAnalysisResultByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('extract a CodeQL static analysis by null repository list', async () => {

        // Given

        let repositoryList = null;
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.extractAnalysisResultByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('extract a CodeQL static analysis by repository list with undefined repositories', async () => {

        // Given

        let repositoryList = [undefined];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.extractAnalysisResultByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('extract a CodeQL static analysis by repository list with null repositories', async () => {

        // Given

        let repositoryList = [null];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.extractAnalysisResultByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    it('extract a CodeQL static analysis by empty repository list', async () => {

        // Given

        let repositoryList = [];
        let staticAnalyzerCodeQL = new StaticAnalyzerCodeQL();

        // When Then

        await expect(staticAnalyzerCodeQL.extractAnalysisResultByList(repositoryList)).rejects.toThrow(BadFormat);
    });

    // TODO : Tests for CodeQLStaticAnalyzer::interpretAnalysisResult
});