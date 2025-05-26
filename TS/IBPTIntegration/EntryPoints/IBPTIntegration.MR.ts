/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @author Lucas Monaco - ProjectDome
 */

import { EntryPoints } from 'N/types';
import * as Log from 'N/log';
import * as Cache from 'N/cache';

import { createOrUpdateEstimatedTax } from '../UseCases/CreateOrUpdateEstimatedTaxes';
import { getAllItems } from '../UseCases/GetAllItems';
import { requestIBPT } from '../UseCases/RequestIBPT';
import { getParameterization } from '../UseCases/GetParameterization';

export const getInputData: EntryPoints.MapReduce.getInputData = () => { 

    const parametrization = getParameterization();

    let allItems =  getAllItems();

    allItems = allItems.map(obj => ({
        ...obj,
        accessToken: parametrization.accessToken,
        uf: parametrization.uf,
    }));

    return allItems;
};

export const map: EntryPoints.MapReduce.map = (context) => {
    const estimatedTax = JSON.parse(context.value);

    try {
        const response = requestIBPT(estimatedTax);

        if (!response.Codigo) return;

        const isUpdated = estimatedTax.id == null;

        if (isUpdated) 
            createOrUpdateEstimatedTax(estimatedTax, response, estimatedTax.estimatedTaxId);
        else 
            createOrUpdateEstimatedTax(estimatedTax, response);
        
    } catch (e) {
        Log.error({ title: 'Error in map stage', details: e });
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