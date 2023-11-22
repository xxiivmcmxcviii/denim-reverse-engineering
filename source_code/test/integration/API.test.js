const request = require("supertest");

const baseURL = "http://localhost:8080"; // If dockerized.
//const baseURL = "http://localhost:3000"; // If not dockerized, launch from the npm console.

// Setup

const gitRepositoryList = ["https://github.com/overleaf/document-updater.git"];

// Happy path test suite

describe("DENIM Reverse Engineering API", () => {

    it("analyze statically a repository list", () => {
        return request(baseURL)
            .post("/static")
            .send(gitRepositoryList)
            .expect(200)
            .then(response => {
                // expect(response.body).toStrictEqual(); // TODO: Test the analysis result content.
                expect(true).toStrictEqual(true); // TODO: To remove, for test purpose only
            });
    });
});

// Failure cases test suite

describe('DENIM Reverse Engineering API tries to', () => {

    it('analyzes statically an undefined git repository list', async () => {
        return request(baseURL)
            .post("/static")
            .send(undefined)
            .expect(404)
    });

    it('analyzes statically a null git repository list', async () => {
        return request(baseURL)
            .post("/static")
            .send(null)
            .expect(404)
    });

    it('analyzes statically an empty git repository list', async () => {

        return request(baseURL)
            .post("/static")
            .send([])
            .expect(404)
    });
});