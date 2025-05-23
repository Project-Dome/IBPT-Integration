/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
*/

import * as Search from 'N/search';
import * as record from 'N/record';
import * as Format from 'N/format';

export const getAllEstimatedTaxes = () => {
    const estimatedTaxes: any[] = []
    const itensSearch = Search.create({
        type: 'customrecord_brl_estimated_taxes',
        columns: [
            'custrecord_brl_esttx_l_item_code.custrecord_fte_itemcode_t_code',
        ]
    }).runPaged({
        pageSize: 1000,
    })
    itensSearch.pageRanges.forEach((pageRange) => {
        const page = itensSearch.fetch({ index: pageRange.index });
        page.data.forEach((result) => {
            estimatedTaxes.push({
                id: result.id,
                itemCod: String(result.getValue({join:'custrecord_brl_esttx_l_item_code', name: 'custrecord_fte_itemcode_t_code'})).replace(/[^a-zA-Z0-9]/g, ''),

            });
        });
    });
    return estimatedTaxes;
};
    

export const getItemCode = () => {
    const itemCode: any[] = []
    const itemSearch = Search.create({
        type: 'customrecord_fte_itemcode',
        columns: [
            'custrecord_fte_itemcode_t_code',
        ]
    }).runPaged({
        pageSize: 1000,
    })
    itemSearch.pageRanges.forEach((pageRange) => {
        const page = itemSearch.fetch({ index: pageRange.index });
        page.data.forEach((result) => {
            itemCode.push({
                id: result.id,
                itemCod: String(result.getValue({name: 'custrecord_fte_itemcode_t_code'})).replace(/[^a-zA-Z0-9]/g, ''),
 
            });
        });
    });
    return itemCode;
};

export const getAllItems = () => {

    const estimatedTaxes = getAllEstimatedTaxes();
    const itemCodes = getItemCode();

    const items = itemCodes.map((item) => {

        const filterTax = estimatedTaxes.filter(tax => tax.itemCod === item.itemCod);

        const itemType = item.itemCod.length > 4 ? "product" : "service";

        return {
            itemCodesId: item.id,
            itemCod: item.itemCod,
            itemType: itemType,
            estimatedTaxId: filterTax.length > 0 ? filterTax[0].id : null,
            itemTypeCode: itemType === 'product' ? 1 : 2,
            
        };
    });
    return items;
}

export const decideTypeRecord = (response: any, objRecord: any, items:any) => {


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
    objRecord.save({
    });
}

export const createEstimatedTax = (response: any,items:any) => {

    const objRecord = record.create({
        type: 'customrecord_brl_estimated_taxes',
    });

    decideTypeRecord(response, objRecord, items);
}

export const updateEstimatedTax = (estimatedTaxId: number, response: any, estimatedTax:any) => {

    var objRecord = record.load({
        type: 'customrecord_brl_estimated_taxes',
        id: estimatedTaxId,
    });
    
    decideTypeRecord(response, objRecord, estimatedTax);
}
  