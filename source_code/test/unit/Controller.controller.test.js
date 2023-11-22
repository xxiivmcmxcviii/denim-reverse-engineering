// Controllers
const Controller = require('../../controller/Controller.controller.js');
// Errors
const DownloadFail = require("../../error/DownloadFail.error.js");
const BadFormat = require("../../error/BadFormat.error.js");
// Libraries
const fs = require("fs");

// Happy path test suite

describe('Controller', () => {

    it('analyzes statically a git repository list', async () => {

        // Given

        let controller = new Controller();
        let gitRepositoryList = ["https://github.com/overleaf/document-updater.git"];

        // When Then

        await controller.analyzeStatically(gitRepositoryList).then((result) => {
            expect(true).toEqual(true); // TODO: Test the analysis result content.
        });
    });
});

// Failure cases test suite

describe('Controller tries to', () => {

    it('analyzes statically a not found git repository', async () => {

        // Given

        let controller = new Controller();
        let gitRepositoryList = ["https://github.com/unknown/unknown.git"];

        // When Then

        await expect(controller.analyzeStatically(gitRepositoryList)).rejects.toThrow(DownloadFail);
    });

    it('analyzes statically an undefined git repository list', async () => {

        // Given

        let controller = new Controller();
        let gitRepositoryList = undefined;

        // When Then

        await expect(controller.analyzeStatically(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('analyzes statically a null git repository list', async () => {

        // Given

        let controller = new Controller();
        let gitRepositoryList = null;

        // When Then

        await expect(controller.analyzeStatically(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('analyzes statically an empty git repository list', async () => {

        // Given

        let controller = new Controller();
        let gitRepositoryList = [];

        // When Then

        await expect(controller.analyzeStatically(gitRepositoryList)).rejects.toThrow(BadFormat);
    });
});