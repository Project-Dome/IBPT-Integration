/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
*/

import * as Record from 'N/record';
import * as Format from 'N/format';
import * as Log from 'N/log';
//import * as Search from 'N/search';

export const createOrUpdateEstimatedTax = (item: any, response: any, estimatedTaxId?: string) => {

    Log.audit({
        title: 'createOrUpdateEstimatedTax',
        details: `Item: ${JSON.stringify(item)} Response: ${JSON.stringify(response)} EstimatedTaxId: ${estimatedTaxId}`,
    });
    //const searchResult = getExistingEstimatedTaxIdByItemCode(item.itemCodesId);

    const today = new Date();
    let objRecord;

    if (estimatedTaxId) {
        const vigenciaFim = item.vigenciaFim ? new Date(item.vigenciaFim) : null;

        if (vigenciaFim && vigenciaFim >= today) {
            Log.audit({
                title: 'EstimatedTax ainda válido, ignorando atualização',
                details: `ItemCod: ${item.itemCod} | Vigência Fim: ${vigenciaFim}`,
            });
            return null;
        }

        objRecord = Record.load({
            type: 'customrecord_brl_estimated_taxes',
            id: estimatedTaxId,
        });
    } else {
        objRecord = Record.create({
            type: 'customrecord_brl_estimated_taxes',
        });
    }

    setRecordValue(objRecord, response, item);

    const savedId = objRecord.save();

    Log.audit({
        title: estimatedTaxId ? 'Atualizado' : 'Criado',
        details: `Registro ID: ${savedId}`
    });

    return savedId;
};

// const getExistingEstimatedTaxIdByItemCode = (itemCodeId: string): string | null => {
//     const searchResult = Search.create({
//         type: 'customrecord_brl_estimated_taxes',
//         filters: [
//             ['custrecord_brl_esttx_l_item_code', 'is', itemCodeId]
//         ],
//         columns: ['internalid']
//     }).run().getRange({ start: 0, end: 1 });

//     if (searchResult.length > 0) {
//         return searchResult[0].getValue({ name: 'internalid' }) as string;
//     }

//     return null;
// };
 

const setRecordValue = (objRecord: Record.Record, response: any, item: any) => {
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
}
 