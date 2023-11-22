// Constants

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const applicationPort = 3000;

// Settings

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Utilities

function getWarehouseHostPort() {
    return process.env.WAREHOUSE_HOST + ":" + process.env.WAREHOUSE_PORT;
}

function getProductHostPort() {
    return process.env.PRODUCT_HOST + ":" + process.env.PRODUCT_PORT;
}

function getStockHostPort() {
    return process.env.STOCK_HOST + ":" + process.env.STOCK_PORT;
}

function get(requestToProxy, response) {
    axios.get(requestToProxy)
        .then((proxyResponse) => {
            response.status(proxyResponse.status);
            response.json(proxyResponse.data);
        })
        .catch((proxyError) => {
            response.status(proxyError.response.status);
            response.json(proxyError.message);
        });
}

function post(requestToProxy, bodyToProxy, response) {
    axios.post(requestToProxy, bodyToProxy)
        .then((proxyResponse) => {
            response.status(proxyResponse.status);
            response.json();
        })
        .catch((proxyError) => {
            response.status(proxyError.response.status);
            response.json(proxyError.message);
        });
}

function put(requestToProxy, bodyToProxy, response) {
    axios.put(requestToProxy, bodyToProxy)
        .then((proxyResponse) => {
            response.status(proxyResponse.status);
            response.json();
        })
        .catch((proxyError) => {
            response.status(proxyError.response.status);
            response.json(proxyError.message);
        });
}

// Routes

app.get('/warehouses', function (request, response) {
    get(getWarehouseHostPort() + "/", response);
});

app.post('/warehouses', function (request, response) {
    post(getWarehouseHostPort() + "/", request.body, response);
});

app.get('/warehouses/:warehouse_name', function (request, response) {
    get(getWarehouseHostPort() + "/" + request.params.warehouse_name, response);
});

app.put('/warehouses/:warehouse_name', function (request, response) {
    put(getWarehouseHostPort() + "/" + request.params.warehouse_name, request.body, response);
});

app.get('/products', function (request, response) {
    get(getProductHostPort() + "/", response);
});

app.get('/products/:product_name', function (request, response) {
    get(getProductHostPort() + "/" + request.params.product_name, response);
});

app.put('/products/:product_name', function (request, response) {
    put(getProductHostPort() + "/" + request.params.product_name, request.body, response);
});

app.get('/stocks', function (request, response) {
    get(getStockHostPort() + "/", response);
});

app.get('/stocks/:product_name', function (request, response) {
    get(getStockHostPort() + "/" + request.params.product_name, response);
});

app.get('/stocks/:product_name/:warehouse_name', function (request, response) {
    get(getStockHostPort() + "/" + request.params.product_name + "/" + request.params.warehouse_name , response);
});

app.put('/stocks/:product_name/:warehouse_name', function (request, response) {
    put(getStockHostPort() + "/" + request.params.product_name + "/" + request.params.warehouse_name , request.body, response);
});

// Entry point

app.listen(applicationPort);
