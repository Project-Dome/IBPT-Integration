/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Lucas Monaco
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
define(["require", "exports", "N/task", "N/cache"], function (require, exports, task, nCache) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.get = void 0;
    task = __importStar(task);
    nCache = __importStar(nCache);
    function get() {
        var taskId = getTaskId();
        if (!taskId)
            return {
                status: ''
            };
        var statusObj = task.checkStatus({ taskId: taskId });
        return {
            status: statusObj.status
        };
    }
    exports.get = get;
    var getTaskId = function () {
        var cache = nCache.getCache({
            name: "IBPTIntegration",
            scope: nCache.Scope.PUBLIC,
        });
        var taskId = cache.get({ key: 'taskId' });
        return taskId;
    };
});
