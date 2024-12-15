"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
const express_1 = __importDefault(require("express"));
const winston_1 = __importDefault(require("winston"));
const analyze_1 = require("../controllers/analyze");
const router = express_1.default.Router();
router.post('/', analyze_1.analyzeText);
// Configure Winston logger
const logger = winston_1.default.createLogger({
    level: 'error',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        // Write to error.log
        new winston_1.default.transports.File({ filename: 'error.log' }),
        // Also log to console in development
        ...(process.env.NODE_ENV !== 'production'
            ? [new winston_1.default.transports.Console()]
            : [])
    ]
});
const logError = (message, details) => {
    const sanitizedDetails = {
        ...details,
        body: details.body ? '[REDACTED]' : undefined
    };
    logger.error(message, sanitizedDetails);
};
exports.logError = logError;
exports.default = router;
//# sourceMappingURL=analyze.js.map