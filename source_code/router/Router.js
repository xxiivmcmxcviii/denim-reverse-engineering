// Routes constants

const express = require('express');
const router = express.Router();
const Controller = require('../controller/Controller.controller.js');
const DownloadFail = require("../error/DownloadFail.error.js");
const AnalysisFail = require("../error/AnalysisFail.error.js");
const CleaningFail = require("../error/CleaningFail.error.js");
const {BAD_FORMAT} = require("../error/Constant.error");
const controller = new Controller();

// Routes detail

router.post('/static', function (request, response) {
    let requestBody = request.body;
    if (requestBody !== undefined
        && requestBody !== null
        && requestBody.length !== 0
        && JSON.stringify(requestBody) !== JSON.stringify({})
        && JSON.stringify(requestBody) !== JSON.stringify([])) {
        controller.analyzeStatically(request.body)
            .then((result) => {
                response.status(200);
                response.json(result);
            })
            .catch((error) => {
                switch (true) {
                    case error instanceof DownloadFail:
                        response.status(404);
                        break;
                    case error instanceof AnalysisFail:
                        response.status(500);
                        break;
                    case error instanceof CleaningFail:
                        response.status(500);
                        break;
                    default:
                        response.status(500);
                        break;
                }
                response.json({name: error.name, message: error.message});
            });
    } else {
        response.status(404);
        response.json({name: BAD_FORMAT, message: ""});
    }
});

// Routes export

module.exports = router;