/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
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
define(["require", "exports", "N/log", "N/ui/message", "N/cache", "N/task"], function (require, exports, log_1, Message, Cache, Task) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.beforeLoad = void 0;
    Message = __importStar(Message);
    Cache = __importStar(Cache);
    Task = __importStar(Task);
    var beforeLoad = function (context) {
        try {
            var form = context.form;
            form.clientScriptModulePath = './IBPTButton.CS';
            var taskStatus = getStatus();
            (0, log_1.error)('taskStatus', taskStatus);
            if (taskStatus === 'Processing')
                Message.create({
                    title: "Aguarde",
                    message: "Aguarde, o processo de atualização de impostos está em andamento.",
                    type: Message.Type.CONFIRMATION
                });
            else
                form.addButton({
                    id: 'custpage_ibpt_button',
                    label: 'Atualizar Versão dos Impostos',
                    functionName: 'updateTaxesVersion',
                });
        }
        catch (e) {
            (0, log_1.error)('beforeLoad error', e);
        }
    };
    exports.beforeLoad = beforeLoad;
    var getStatus = function () {
        var cache = Cache.getCache({
            name: "IBPTIntegration",
            scope: Cache.Scope.PUBLIC,
        });
        var taskId = cache.get({ key: 'taskId' });
        if (!taskId)
            return '';
        return String(Task.checkStatus({ taskId: taskId }));
    };
});
