// Helpers
const DownloaderGit = require('../../helper/DownloaderGit.helper.js');
// Libraries
const fs = require('fs');
// Constants
const {FILE_SYSTEM_SEPARATOR} = require("../../helper/Constant.helper");
// Errors
const DownloadFail = require("../../error/DownloadFail.error.js");
const BadFormat = require("../../error/BadFormat.error.js");

// Setup

const directoryList = ["document-updater"];
const repositoryList = ["https://github.com/overleaf/document-updater.git"];

// Happy path test suite

describe('Git downloader', () => {

    afterEach(async () => {
        // Cleaning.
        for (let i = 0; i < directoryList.length; i++) {
            if (fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[i])) {
                await fs.rmdirSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[i], {recursive: true});
            }
        }
    });

    it('downloads a repository', async () => {

        // Given

        let downloaderGit = new DownloaderGit();

        // When Then

        await downloaderGit.downloadByElement(repositoryList[0]).then((result) => {
            const repositoryCloned = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[0]);
            const returnedDownloadedRepositoryEqualsToGivenRepository = result === directoryList[0];
            expect(repositoryCloned && returnedDownloadedRepositoryEqualsToGivenRepository).toBe(true);
        });
    });

    it('downloads a repository list', async () => {

        // Given

        let downloaderGit = new DownloaderGit();

        // When Then

        await downloaderGit.downloadByList(repositoryList).then(async (result) => {
            const repositoryCloned1 = fs.existsSync(process.cwd() + FILE_SYSTEM_SEPARATOR + "TEMP" + FILE_SYSTEM_SEPARATOR + directoryList[0]);
            let returnedDownloadedRepositoriesListEqualsToGivenRepositoriesList = (JSON.stringify(result) === JSON.stringify([directoryList[0]]));
            expect(repositoryCloned1 && returnedDownloadedRepositoriesListEqualsToGivenRepositoriesList).toBe(true);
        });
    });
});

// Failure cases test suite

describe('Git downloader tries to', () => {

    it('download a not found git repository', async () => {

        // Given

        let downloaderGit = new DownloaderGit();
        let gitRepository = "https://github.com/unknown/unknown.git";

        // When Then

        await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(DownloadFail);
    });

    it('download a git repository list with not found repositories', async () => {

        // Given

        let gitRepositoryList = ["https://github.com/unknown/unknown.git"];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(DownloadFail);
    });

    it('download an undefined git repository', async () => {

        // Given

        let downloaderGit = new DownloaderGit();
        let gitRepository = undefined;

        // When Then

        await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(BadFormat);

    });

    it('download an undefined git repository list', async () => {

        // Given

        let gitRepositoryList = undefined;
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download a null git repository', async () => {

        // Given

        let downloaderGit = new DownloaderGit();
        let gitRepository = null;

        // When Then

        await expect(downloaderGit.downloadByElement(gitRepository)).rejects.toThrow(BadFormat);

    });

    it('download a null git repository list', async () => {

        // Given

        let gitRepositoryList = null;
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });

    it('download a git repository list with undefined repositories', async () => {

        // Given

        let gitRepositoryList = [undefined];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(DownloadFail);
    });

    it('download a git repository list with null repositories', async () => {

        // Given

        let gitRepositoryList = [null];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(DownloadFail);
    });

    it('download an empty git repository list', async () => {

        // Given

        let gitRepositoryList = [];
        let downloaderGit = new DownloaderGit();

        // When Then

        await expect(downloaderGit.downloadByList(gitRepositoryList)).rejects.toThrow(BadFormat);
    });
});