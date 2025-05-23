/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @author Lucas Monaco - ProjectDome
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
define(["require", "exports", "N/log", "N/log", "../UseCases/UpdateEstimatedTaxes", "../UseCases/RequestIBPT", "N/cache"], function (require, exports, log_1, log, UpdateEstimatedTaxes_1, RequestIBPT_1, nCache) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.map = exports.getInputData = void 0;
    log = __importStar(log);
    nCache = __importStar(nCache);
    var getInputData = function () {
        log.debug({
            title: 'Task ID',
            details: 'getInputData'
        });
        var teste = [(0, UpdateEstimatedTaxes_1.getAllItems)()[0]];
        return teste;
    };
    exports.getInputData = getInputData;
    var map = function (context) {
        var estimatedTax = JSON.parse(context.value);
        try {
            var isUpdated = estimatedTax.id == null;
            var response = (0, RequestIBPT_1.requestIBPT)(estimatedTax);
            if (isUpdated) {
                (0, UpdateEstimatedTaxes_1.updateEstimatedTax)(estimatedTax.estimatedTaxId, response, estimatedTax);
            }
            else {
                (0, UpdateEstimatedTaxes_1.createEstimatedTax)(response, estimatedTax);
            }
            (0, log_1.error)('Response:', response);
        }
        catch (e) {
            (0, log_1.error)({ title: 'Error in map stage', details: e });
        }
    };
    exports.map = map;
    var summarize = function (_context) {
        var cache = nCache.getCache({
            name: "IBPTIntegration",
            scope: nCache.Scope.PUBLIC,
        });
        cache.remove({
            key: 'taskId'
        });
    };
    exports.summarize = summarize;
});
