"use strict";
/**
 * Main application entry point with Express server setup
 * @module app
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// Core dependencies
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
// Security dependencies
// Routes and middleware
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const analyze_1 = __importDefault(require("./routes/analyze"));
const auth_1 = __importDefault(require("./routes/auth"));
const stories_1 = __importDefault(require("./routes/stories"));
const users_1 = __importDefault(require("./routes/users"));
// Load environment variables
dotenv_1.default.config();
/**
 * Centralized configuration object
 */
exports.config = {
    port: parseInt(process.env.PORT || '3000', 10),
    mongoUri: process.env.MONGO_URI || '',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*',
};
// Create Express application instance
const app = (0, express_1.default)();
/**
 * Security middleware configuration
 */
// Enhanced Helmet configuration
app.use((0, helmet_1.default)({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true,
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Request parsing with security limits
app.use(body_parser_1.default.json({ limit: '1mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
/**
 * Health check endpoint
 */
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
/**
 * API route configuration
 */
app.use('/api/v1/analyze', analyze_1.default);
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/users', users_1.default);
app.use('/api/v1/stories', stories_1.default);
// Global error handler
app.use(errorHandler_1.default);
// Start server
app.listen(exports.config.port, () => {
    console.log(`Server running on port ${exports.config.port} in ${exports.config.nodeEnv} mode`);
    console.log(`Health check available at http://localhost:${exports.config.port}/health`);
});
exports.default = app;
//# sourceMappingURL=app.js.map