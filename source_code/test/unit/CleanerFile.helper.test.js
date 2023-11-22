// Helpers
const CleanerFile = require('../../helper/CleanerFile.helper.js');
// Libraries
const fs = require('fs');
// Constants
const {FILE_SYSTEM_SEPARATOR} = require("../../helper/Constant.helper");
// Errors
const CleaningFail = require("../../error/CleaningFail.error.js");
const BadFormat = require("../../error/BadFormat.error.js");

// Setup

const directoryList = ["raindrop-microservice-application-example-api-minimal"];

// Happy path test suite

describe('File cleaner', () => {


    beforeEach(async () => {
        // Preparing.
        for (let i = 0; i < directoryList.length; i++) {
            if (!fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[i])) {
                await fs.mkdirSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[i]);
                await fs.copyFileSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "test" + FILE_SYSTEM_SEPARATOR + "unit" + FILE_SYSTEM_SEPARATOR + "asset" + FILE_SYSTEM_SEPARATOR + "index.example.js", process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[i] + FILE_SYSTEM_SEPARATOR + "index.js");
            }
        }
    });

    it('cleans a directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await cleanerFile.cleanByElement(directoryList[0]).then((result) => {
            const directoryDeleted = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[0]);
            expect(directoryDeleted).toBe(false);
        });
    });

    it('cleans a directory list', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await cleanerFile.cleanByList(directoryList).then(async (result) => {
            const directoryDeleted1 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[0]);
            expect(directoryDeleted1).toBe(false);
        });
    });

    it('cleans all directories in a directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await cleanerFile.cleanAll().then(async (result) => {
            const directoryDeleted1 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[0]);
            expect(directoryDeleted1).toBe(false);
        });
    });
});

// Failure cases test suite

describe('File cleaner tries to', () => {

    it('clean a not found directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByElement("unknown")).rejects.toThrow(CleaningFail);
    });

    it('clean a list with not found directories', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList(["unknown"])).rejects.toThrow(CleaningFail);
    });

    it('clean an undefined directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByElement(undefined)).rejects.toThrow(BadFormat);

    });

    it('clean an undefined directory list', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList(undefined)).rejects.toThrow(BadFormat);
    });

    it('clean a null directory', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByElement(null)).rejects.toThrow(BadFormat);

    });

    it('clean a null directory list', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList(null)).rejects.toThrow(BadFormat);
    });

    it('clean a directory list with undefined directories', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList([undefined])).rejects.toThrow(CleaningFail);
    });

    it('clean a directory list with null directories', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList([null])).rejects.toThrow(CleaningFail);
    });

    it('clean an empty directory list', async () => {

        // Given

        let cleanerFile = new CleanerFile();

        // When Then

        await expect(cleanerFile.cleanByList([])).toBeInstanceOf(Promise);
    });
});