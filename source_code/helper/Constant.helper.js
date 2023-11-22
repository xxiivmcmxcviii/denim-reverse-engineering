// Libraries
const dotenv = require('dotenv');

/**
 * @overview Represents the helper constants.
 */

// Configuration
dotenv.config();

// Constant
const FILE_SYSTEM_SEPARATOR = process.env.FILE_SYSTEM_SEPARATOR;

module.exports = {
    FILE_SYSTEM_SEPARATOR
}