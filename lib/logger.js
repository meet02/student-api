'use strict';

const winston = require('winston');
const fs = require('fs')
const path = require('path')
const { createLogger, format, transports } = require('winston');
const logDir = 'log';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

var now = new Date()
const filename = path.join(logDir, `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-results.log`);

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console({
            level: 'info',
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }),
        new transports.File({ filename })
    ]
});

module.exports = logger