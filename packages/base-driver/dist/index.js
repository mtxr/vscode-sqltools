"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = require("@sqltools/util/connection");
var exception_1 = require("@sqltools/util/exception");
var require_1 = __importDefault(require("@sqltools/util/dependencies/require"));
var log_1 = __importDefault(require("@sqltools/util/log"));
var AbstractDriver = (function () {
    function AbstractDriver(credentials) {
        this.credentials = credentials;
        this.deps = [];
        this.log = log_1.default.extend(credentials.driver.toLowerCase());
    }
    AbstractDriver.prototype.getId = function () {
        return connection_1.getConnectionId(this.credentials) || 'BROKEN';
    };
    AbstractDriver.prototype.singleQuery = function (query, opt) {
        return this.query(query, opt).then(function (_a) {
            var res = _a[0];
            return res;
        });
    };
    AbstractDriver.prototype.describeTable = function (metadata, opt) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.singleQuery(this.queries.describeTable(metadata), opt)];
                    case 1:
                        result = _a.sent();
                        result.baseQuery = this.queries.describeTable.raw;
                        return [2, [result]];
                }
            });
        });
    };
    AbstractDriver.prototype.showRecords = function (table, opt) {
        return __awaiter(this, void 0, void 0, function () {
            var limit, _a, page, params, _b, records, totalResult;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        limit = opt.limit, _a = opt.page, page = _a === void 0 ? 0 : _a;
                        params = { limit: limit, table: table, offset: page * limit };
                        if (!(typeof this.queries.fetchRecords === 'function' && typeof this.queries.countRecords === 'function')) return [3, 2];
                        return [4, (Promise.all([
                                this.singleQuery(this.queries.fetchRecords(params), opt),
                                this.singleQuery(this.queries.countRecords(params), opt),
                            ]))];
                    case 1:
                        _b = _c.sent(), records = _b[0], totalResult = _b[1];
                        records.baseQuery = this.queries.fetchRecords.raw;
                        records.pageSize = limit;
                        records.page = page;
                        records.total = Number(totalResult.results[0].total);
                        records.queryType = 'showRecords';
                        records.queryParams = table;
                        return [2, [records]];
                    case 2: return [2, this.query(this.queries.fetchRecords(params), opt)];
                }
            });
        });
    };
    AbstractDriver.prototype.needToInstallDependencies = function () {
        var _this = this;
        if (parseInt(process.env.IS_NODE_RUNTIME || '0') !== 1) {
            throw new exception_1.ElectronNotSupportedError();
        }
        if (this.deps && this.deps.length > 0) {
            this.deps.forEach(function (dep) {
                var mustUpgrade = false;
                switch (dep.type) {
                    case AbstractDriver.CONSTANTS.DEPENDENCY_PACKAGE:
                        try {
                            delete require_1.default.cache[require_1.default.resolve(dep.name + '/package.json')];
                            var version = require_1.default(dep.name + '/package.json').version;
                            if (dep.version && version !== dep.version) {
                                mustUpgrade = true;
                                throw new Error("Version not matching. We need to upgrade " + dep.name);
                            }
                            require_1.default(dep.name);
                        }
                        catch (e) {
                            throw new exception_1.MissingModuleError(_this.deps, _this.credentials, mustUpgrade);
                        }
                        break;
                }
            });
        }
        return false;
    };
    AbstractDriver.prototype.getBaseQueryFilters = function () {
        var databaseFilter = this.credentials.databaseFilter || {};
        databaseFilter.show = databaseFilter.show || (!databaseFilter.hide ? [this.credentials.database] : []);
        databaseFilter.hide = databaseFilter.hide || [];
        return {
            databaseFilter: databaseFilter
        };
    };
    AbstractDriver.prototype.getChildrenForItem = function (_params) {
        this.log.extend('error')("###### Attention ######getChildrenForItem not implemented for " + this.credentials.driver + "\n####################");
        return Promise.resolve([]);
    };
    AbstractDriver.prototype.searchItems = function (_itemType, _search, _extraParams) {
        this.log.extend('error')("###### Attention ######searchItems not implemented for " + this.credentials.driver + "\n####################");
        return Promise.resolve([]);
    };
    AbstractDriver.prototype.prepareMessage = function (message) {
        return { message: message.toString(), date: new Date() };
    };
    AbstractDriver.CONSTANTS = {
        DEPENDENCY_PACKAGE: 'package',
        DEPENDENCY_NPM_SCRIPT: 'npmscript',
    };
    return AbstractDriver;
}());
exports.default = AbstractDriver;
