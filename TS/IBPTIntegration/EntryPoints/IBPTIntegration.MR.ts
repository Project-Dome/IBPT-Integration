/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @author Lucas Monaco - ProjectDome
 */

import { EntryPoints } from 'N/types';
import * as Log from 'N/log';
import * as Cache from 'N/cache';
import * as Runtime from 'N/runtime';

import { createOrUpdateEstimatedTax } from '../UseCases/CreateOrUpdateEstimatedTaxes';
import { getAllItems, getItemCodeByEstimatedTaxId } from '../UseCases/GetAllItems';
import { requestIBPT } from '../UseCases/RequestIBPT';
import { getParameterization } from '../UseCases/GetParameterization';

export const getInputData: EntryPoints.MapReduce.getInputData = () => {
    try {
        const estimatedTaxId = Runtime.getCurrentScript().getParameter({
            name: 'custscript_pd_ib_estimated_taxes_id'
        });

        Log.debug({ title: 'getInputData', details: `EstimatedTaxId: ${estimatedTaxId}` });

        const parametrization = getParameterization();
        Log.debug({ title: 'Parametrization', details: JSON.stringify(parametrization) });

        if (estimatedTaxId) {
            const itemCode = getItemCodeByEstimatedTaxId(String(estimatedTaxId));
            Log.debug({ title: 'ItemCode Result', details: JSON.stringify(itemCode) });
            if (!itemCode) return [];
            return [{
                ...itemCode,
                accessToken: parametrization.accessToken,
                uf: parametrization.uf,
            }];
        }

        let allItems = getAllItems();

        allItems = allItems.map(obj => ({
            ...obj,
            accessToken: parametrization.accessToken,
            uf: parametrization.uf,
        }));

        return allItems;
    } catch (e) {
        Log.error({ title: 'Error in getInputData stage', details: e });
        return [];
    }
};

export const map: EntryPoints.MapReduce.map = (context) => {
    const estimatedTax = JSON.parse(context.value);

    try {
        const response = requestIBPT(estimatedTax);
        Log.debug({
            title: '1- Response from IBPT',
            details: response.Codigo
        });

        if (!response.Codigo) return;

        Log.debug({
            title: '2- Response from IBPT',
            details: `${response.Codigo}`
        });

        const isUpdated = estimatedTax.estimatedTaxId != null && estimatedTax.estimatedTaxId !== '';

        Log.debug({
            title: 'isUpdated',
            details: `isUpdated: ${isUpdated}, estimatedTaxId: ${estimatedTax.estimatedTaxId}`
        });

        let recordId;
        if (isUpdated) {
            recordId = createOrUpdateEstimatedTax(estimatedTax, response, estimatedTax.estimatedTaxId);
            Log.debug({
                title: '3- RecordId after update',
                details: `RecordId: ${recordId}`
            });
        } else {
            recordId = createOrUpdateEstimatedTax(estimatedTax, response);
            Log.debug({
                title: '3- RecordId after create',
                details: `RecordId: ${recordId}`
            });
        }

        Log.audit({
            title: 'IBPT Atualizado',
            details: `Item: ${estimatedTax.itemCod}, RecordId: ${recordId}, Ação: ${isUpdated ? 'Atualizado' : 'Criado'}, VigenciaFim: ${estimatedTax.vigenciaFim}`,
        });

    } catch (e) {
        Log.error({
            title: 'Error in map stage', details: e
        });
        throw e;
    }
};

export const summarize: EntryPoints.MapReduce.summarize = (_context) => {
    clearTaskIdCache();
}

const clearTaskIdCache = () => {
    const cache = Cache.getCache({
        name: "IBPTIntegration",
        scope: Cache.Scope.PUBLIC,
    });
    cache.remove({ key: 'taskId' });
}