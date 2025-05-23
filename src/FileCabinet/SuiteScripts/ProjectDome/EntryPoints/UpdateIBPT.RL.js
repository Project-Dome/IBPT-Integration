/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Lucas Monaco - ProjectDome
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
define(["require", "exports", "N/task", "N/log", "N/cache"], function (require, exports, task, log, nCache) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCacheWithTaskId = exports.get = void 0;
    task = __importStar(task);
    log = __importStar(log);
    nCache = __importStar(nCache);
    var get = function (_context) {
        try {
            var updateIBPT = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_pd_ib_ibpt_integration_mr',
                deploymentId: 'customdeploy_pd_ib_ibpt_integ_mr_ns',
            });
            var taskId = updateIBPT.submit();
            (0, exports.setCacheWithTaskId)(taskId);
            log.debug({
                title: 'Task ID',
                details: taskId
            });
            return taskId;
        }
        catch (e) {
            return {
                error: true,
                message: 'Error in get method',
                details: e,
            };
        }
    };
    exports.get = get;
    var setCacheWithTaskId = function (taskId) {
        var cache = nCache.getCache({
            name: "IBPTIntegration",
            scope: nCache.Scope.PUBLIC,
        });
        cache.put({
            key: 'taskId',
            value: taskId,
            ttl: 60 * 60 * 24,
        });
    };
    exports.setCacheWithTaskId = setCacheWithTaskId;
});
