/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
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
define(["require", "exports", "N/record", "N/format"], function (require, exports, Record, Format) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createOrUpdateEstimatedTax = void 0;
    Record = __importStar(Record);
    Format = __importStar(Format);
    var createOrUpdateEstimatedTax = function (item, response, estimatedTaxId) {
        var objRecord;
        if (estimatedTaxId)
            objRecord = Record.load({
                type: 'customrecord_brl_estimated_taxes',
                id: estimatedTaxId,
            });
        else
            objRecord = Record.create({
                type: 'customrecord_brl_estimated_taxes',
            });
        setRecordValue(objRecord, response, item);
        return objRecord.save();
    };
    exports.createOrUpdateEstimatedTax = createOrUpdateEstimatedTax;
    var setRecordValue = function (objRecord, response, item) {
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_d_effective_from',
            value: Format.parse({ value: response.VigenciaInicio, type: Format.Type.DATE }),
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_d_effective_until',
            value: Format.parse({ value: response.VigenciaFim, type: Format.Type.DATE }),
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_p_fed_txrt_dom_it',
            value: response.Nacional,
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_p_state_txrt',
            value: response.Estadual,
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_p_fed_txrt_imp_it',
            value: response.Importado,
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_p_munc_txrt',
            value: response.Municipal,
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_t_ibpt_chart_key',
            value: response.Chave,
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_t_ibpt_chart_vers',
            value: response.Versao,
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_t_source',
            value: response.Fonte,
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_l_item_code',
            value: item.itemCodesId,
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_l_tp_item_code',
            value: item.itemTypeCode,
        });
    };
});
