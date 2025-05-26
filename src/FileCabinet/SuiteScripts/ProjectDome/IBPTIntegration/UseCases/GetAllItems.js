/**
*@NApiVersion 2.1
 @author Roque Costa - ProjectDome
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
define(["require", "exports", "N/search"], function (require, exports, Search) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getAllItems = void 0;
    Search = __importStar(Search);
    var getAllItems = function () {
        var estimatedTaxes = getAllEstimatedTaxes();
        var itemCodes = getItemCode();
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
                    itemCod: String(result.getValue({ name: 'custrecord_fte_itemcode_t_code' })).replace(/[^a-zA-Z0-9]/g, '')
                });
            });
        });
        return itemCode;
    };
});
