/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @author Lucas Monaco - ProjectDome
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define(["require", "exports", "N/log", "N/cache", "../UseCases/CreateOrUpdateEstimatedTaxes", "../UseCases/GetAllItems", "../UseCases/RequestIBPT", "../UseCases/GetParameterization"], function (require, exports, log_1, Cache, CreateOrUpdateEstimatedTaxes_1, GetAllItems_1, RequestIBPT_1, GetParameterization_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.map = exports.getInputData = void 0;
    Cache = __importStar(Cache);
    var getInputData = function () {
        var parametrization = (0, GetParameterization_1.getParameterization)();
        var allItems = (0, GetAllItems_1.getAllItems)();
        allItems = allItems.map(function (obj) { return (__assign(__assign({}, obj), { accessToken: parametrization.accessToken })); });
        return allItems;
    };
    exports.getInputData = getInputData;
    var map = function (context) {
        var estimatedTax = JSON.parse(context.value);
        try {
            var response = (0, RequestIBPT_1.requestIBPT)(estimatedTax);
            if (!response.Codigo)
                return;
            var isUpdated = estimatedTax.id == null;
            if (isUpdated)
                (0, CreateOrUpdateEstimatedTaxes_1.createOrUpdateEstimatedTax)(estimatedTax, response, estimatedTax.estimatedTaxId);
            else
                (0, CreateOrUpdateEstimatedTaxes_1.createOrUpdateEstimatedTax)(estimatedTax, response);
        }
        catch (e) {
            (0, log_1.error)({ title: 'Error in map stage', details: e });
        }
    };
    exports.map = map;
    var summarize = function (_context) {
        clearTaskIdCache();
    };
    exports.summarize = summarize;
    var clearTaskIdCache = function () {
        var cache = Cache.getCache({
            name: "IBPTIntegration",
            scope: Cache.Scope.PUBLIC,
        });
        cache.remove({ key: 'taskId' });
    };
});
