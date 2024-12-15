"use strict";
// // Generated barrel file - do not modify manually
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = exports.storiesRouter = exports.authRouter = exports.analyzeRouter = void 0;
var analyze_1 = require("./analyze");
Object.defineProperty(exports, "analyzeRouter", { enumerable: true, get: function () { return __importDefault(analyze_1).default; } });
var auth_1 = require("./auth");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var stories_1 = require("./stories");
Object.defineProperty(exports, "storiesRouter", { enumerable: true, get: function () { return __importDefault(stories_1).default; } });
var users_1 = require("./users");
Object.defineProperty(exports, "usersRouter", { enumerable: true, get: function () { return __importDefault(users_1).default; } });
//# sourceMappingURL=index.js.map