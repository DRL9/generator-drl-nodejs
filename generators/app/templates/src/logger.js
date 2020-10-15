const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logDir = path.resolve(process.cwd(), 'logs/');

const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.printf((info) => {
            return `${info.level} [${new Date(info.timestamp).toLocaleString()}]: ${info.message} ${
                info.stack ? '\n' + info.stack : ''
            }`;
        })
    ),
    transports: [
        new winston.transports.File({
            dirname: logDir,
            filename: 'error.log',
            level: 'error',
        }),
        ...(process.env.NODE_ENV === 'production' ? [] : [new winston.transports.Console()]),
        new DailyRotateFile({
            dirname: logDir,
            filename: 'server-%DATE%.log',
            createSymlink: true,
            symlinkName: 'server.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '100m',
            maxFiles: '7d',
        }),
    ],
});

module.exports = logger;

module.exports.stream = {
    write: function (message) {
        logger.info(message);
    },
};
