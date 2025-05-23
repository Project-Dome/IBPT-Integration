/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
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
define(["require", "exports", "N/search", "N/record", "N/log"], function (require, exports, Search, record, log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateTaskId = exports.getParameterization = void 0;
    Search = __importStar(Search);
    record = __importStar(record);
    var getParameterization = function () {
        var subsidiary = Search.create({
            type: 'customrecord_pd_ib_parameterization',
            columns: ['customrecord_pd_ib_uf'],
        }).run().getRange({ start: 0, end: 1 })[0];
        return {
            uf: subsidiary.getValue({ name: 'customrecord_pd_ib_uf' }),
            id: subsidiary.id,
        };
    };
    exports.getParameterization = getParameterization;
    var updateTaskId = function (response, id) {
        var objRecord = record.load({
            type: 'customrecord_pd_ib_parameterization',
            id: id,
        });
        (0, log_1.error)('SetValue', response.taskId);
        objRecord.setValue({
            fieldId: 'custrecord_pd_ib_taskid',
            value: response.taskId,
        });
        objRecord.save();
    };
    exports.updateTaskId = updateTaskId;
});
