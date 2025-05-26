/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @author Lucas Monaco - ProjectDome
 */
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
define(["require", "exports", "N/log", "../UseCases/CreateOrUpdateEstimatedTaxes", "../UseCases/GetAllItems", "../UseCases/RequestIBPT", "N/cache"], function (require, exports, log_1, CreateOrUpdateEstimatedTaxes_1, GetAllItems_1, RequestIBPT_1, Cache) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.map = exports.getInputData = void 0;
    Cache = __importStar(Cache);
    var getInputData = function () {
        return (0, GetAllItems_1.getAllItems)();
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
