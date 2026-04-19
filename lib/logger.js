'use strict';

const winston = require('winston'),
    fs = require('fs'),
    level = process.env.log_level || 'warn';

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);


const transports = [
    new winston.transports.Console({
        level: level,
        colorize: true
    }),
    new winston.transports.File({
        level: level,
        filename: 'out.log'
    })
];


const logger = new ( winston.Logger )({
    transports: transports
});

module.exports = logger;
