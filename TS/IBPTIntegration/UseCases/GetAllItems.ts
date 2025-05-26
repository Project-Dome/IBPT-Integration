/**
*@NApiVersion 2.1
 @author Roque Costa - ProjectDome
*/

import * as Search from 'N/search';

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

const getAllEstimatedTaxes = () => {
    const estimatedTaxes: any[] = [];

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

const getItemCode = () => {
    const itemCode: any[] = [];

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
                itemCod: String(result.getValue({name: 'custrecord_fte_itemcode_t_code'})).replace(/[^a-zA-Z0-9]/g, '')
            });
        });
    });

    return itemCode;
};