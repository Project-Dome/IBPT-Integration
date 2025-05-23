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
define(["require", "exports", "N/search", "N/record", "N/format"], function (require, exports, Search, record, Format) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateEstimatedTax = exports.createEstimatedTax = exports.decideTypeRecord = exports.getAllItems = exports.getItemCode = exports.getAllEstimatedTaxes = void 0;
    Search = __importStar(Search);
    record = __importStar(record);
    Format = __importStar(Format);
    var getAllEstimatedTaxes = function () {
        var estimatedTaxes = [];
        var itensSearch = Search.create({
            type: 'customrecord_brl_estimated_taxes',
            columns: [
                'custrecord_brl_esttx_l_item_code.custrecord_fte_itemcode_t_code',
            ]
        }).runPaged({
            pageSize: 1000,
        });
        itensSearch.pageRanges.forEach(function (pageRange) {
            var page = itensSearch.fetch({ index: pageRange.index });
            page.data.forEach(function (result) {
                estimatedTaxes.push({
                    id: result.id,
                    itemCod: String(result.getValue({ join: 'custrecord_brl_esttx_l_item_code', name: 'custrecord_fte_itemcode_t_code' })).replace(/[^a-zA-Z0-9]/g, ''),
                });
            });
        });
        return estimatedTaxes;
    };
    exports.getAllEstimatedTaxes = getAllEstimatedTaxes;
    var getItemCode = function () {
        var itemCode = [];
        var itemSearch = Search.create({
            type: 'customrecord_fte_itemcode',
            columns: [
                'custrecord_fte_itemcode_t_code',
            ]
        }).runPaged({
            pageSize: 1000,
        });
        itemSearch.pageRanges.forEach(function (pageRange) {
            var page = itemSearch.fetch({ index: pageRange.index });
            page.data.forEach(function (result) {
                itemCode.push({
                    id: result.id,
                    itemCod: String(result.getValue({ name: 'custrecord_fte_itemcode_t_code' })).replace(/[^a-zA-Z0-9]/g, ''),
                });
            });
        });
        return itemCode;
    };
    exports.getItemCode = getItemCode;
    var getAllItems = function () {
        var estimatedTaxes = (0, exports.getAllEstimatedTaxes)();
        var itemCodes = (0, exports.getItemCode)();
        var items = itemCodes.map(function (item) {
            var filterTax = estimatedTaxes.filter(function (tax) { return tax.itemCod === item.itemCod; });
            var itemType = item.itemCod.length > 4 ? "product" : "service";
            return {
                itemCodesId: item.id,
                itemCod: item.itemCod,
                itemType: itemType,
                estimatedTaxId: filterTax.length > 0 ? filterTax[0].id : null,
                itemTypeCode: itemType === 'product' ? 1 : 2,
            };
        });
        return items;
    };
    exports.getAllItems = getAllItems;
    var decideTypeRecord = function (response, objRecord, items) {
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
            value: items.itemCodesId,
        });
        objRecord.setValue({
            fieldId: 'custrecord_brl_esttx_l_tp_item_code',
            value: items.itemTypeCode,
        });
        objRecord.save({});
    };
    exports.decideTypeRecord = decideTypeRecord;
    var createEstimatedTax = function (response, items) {
        var objRecord = record.create({
            type: 'customrecord_brl_estimated_taxes',
        });
        (0, exports.decideTypeRecord)(response, objRecord, items);
    };
    exports.createEstimatedTax = createEstimatedTax;
    var updateEstimatedTax = function (estimatedTaxId, response, estimatedTax) {
        var objRecord = record.load({
            type: 'customrecord_brl_estimated_taxes',
            id: estimatedTaxId,
        });
        (0, exports.decideTypeRecord)(response, objRecord, estimatedTax);
    };
    exports.updateEstimatedTax = updateEstimatedTax;
});
