/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Lucas Monaco - ProjectDome
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
define(["require", "exports", "N/task", "N/cache"], function (require, exports, Task, Cache) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setCacheWithTaskId = exports.get = void 0;
    Task = __importStar(Task);
    Cache = __importStar(Cache);
    var get = function (_context) {
        try {
            var updateIBPT = Task.create({
                taskType: Task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_pd_ib_ibpt_integration_mr',
                deploymentId: 'customdeploy_pd_ib_ibpt_integ_mr_ns',
            });
            var taskId = updateIBPT.submit();
            (0, exports.setCacheWithTaskId)(taskId);
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
        var cache = Cache.getCache({
            name: "IBPTIntegration",
            scope: Cache.Scope.PUBLIC,
        });
        cache.put({
            key: 'taskId',
            value: taskId,
            ttl: 60 * 60 * 24,
        });
    };
    exports.setCacheWithTaskId = setCacheWithTaskId;
});
