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
            if (taskStatus === Task.TaskStatus.PROCESSING)
                form.addPageInitMessage({
                    type: Message.Type.INFORMATION,
                    title: 'Atualização em andamento',
                    message: 'A atualização dos impostos está em andamento. Por favor, aguarde a conclusão.',
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
        var taskStatus = Task.checkStatus({ taskId: taskId });
        return String(taskStatus.status);
    };
});
