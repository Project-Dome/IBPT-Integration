/**
*@NApiVersion 2.1
 @author Roque Costa - ProjectDome
*/

import * as Search from 'N/search';
import * as Log from 'N/log';

export const getAllItems = () => {

    const estimatedTaxes = getAllEstimatedTaxes();
    const itemCodes = getItemCode();
    const items = itemCodes.map((item) => {

        const filterTax = estimatedTaxes.filter(tax => tax.itemCod.replace(/[^a-z0-9]/gi, '') === item.itemCod.replace(/[^a-z0-9]/gi, ''));
        const selectedTax = filterTax[0];

        function stringToDate(stringDate: string): Date {
            return new Date(stringDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
        }

        const vigenciaFim = selectedTax?.vigenciaFim ? stringToDate(selectedTax.vigenciaFim) : null;
        var isExpired = false;

        if (vigenciaFim && vigenciaFim < new Date()) {
            isExpired = true;

        }

        if (!isExpired && vigenciaFim) return null;

        const itemType = item.itemCod.length > 4 ? "product" : "service";

        return {
            itemCodesId: item.id,
            itemCod: item.itemCod,
            itemType: itemType,
            estimatedTaxId: filterTax.length > 0 ? filterTax[0].id : null,
            id: filterTax.length > 0 ? filterTax[0].id : null,
            itemTypeCode: itemType === 'product' ? 1 : 2,
            vigenciaFim: selectedTax?.vigenciaFim || null,
        };

    });
    return items.filter(item => item !== null);
}

const getAllEstimatedTaxes = () => {
    const estimatedTaxes: any[] = [];

    const itensSearch = Search.create({
        type: 'customrecord_brl_estimated_taxes',
        columns: [
            'custrecord_brl_esttx_l_item_code.custrecord_fte_itemcode_t_code',
            'custrecord_brl_esttx_d_effective_until',
        ]
    }).runPaged({
        pageSize: 1000,
    })

    itensSearch.pageRanges.forEach((pageRange) => {
        const page = itensSearch.fetch({ index: pageRange.index });
        page.data.forEach((result) => {
            estimatedTaxes.push({
                id: result.id,
                itemCod: String(result.getValue({ join: 'custrecord_brl_esttx_l_item_code', name: 'custrecord_fte_itemcode_t_code' })).replace(/[^a-zA-Z0-9]/g, ''),
                vigenciaFim: result.getValue({ name: 'custrecord_brl_esttx_d_effective_until' }),
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
                itemCod: String(result.getValue({ name: 'custrecord_fte_itemcode_t_code' })).replace(/[^a-zA-Z0-9]/g, '')
            });
        });
    });

    return itemCode;
};

export const getItemCodeByEstimatedTaxId = (estimatedTaxId: string) => {

    const itemSearch = Search.create({
        type: 'customrecord_brl_estimated_taxes',
        filters: [
            ['internalid', 'is', estimatedTaxId]
        ],
        columns: [
            'custrecord_brl_esttx_l_item_code',
            'custrecord_brl_esttx_l_item_code.custrecord_fte_itemcode_t_code',
            'custrecord_brl_esttx_d_effective_until',
        ]
    }).run().getRange({ start: 0, end: 1 });

    const result = itemSearch[0];

    const vigenciaFim = result.getValue({
        name: 'custrecord_brl_esttx_d_effective_until'
    });

    const itemCode = String(result.getValue({ name: 'custrecord_fte_itemcode_t_code', join: 'custrecord_brl_esttx_l_item_code' })).replace(/[^a-zA-Z0-9]/g, '');
    const itemType = itemCode.length > 4 ? "product" : "service";

    return {
        itemCodesId: result.getValue({ name: 'custrecord_brl_esttx_l_item_code' }),
        itemType: itemType,
        estimatedTaxId: estimatedTaxId,
        itemTypeCode: itemType === 'product' ? 1 : 2,
        id: result.id,
        itemCod: itemCode,
        vigenciaFim: vigenciaFim
    }
}