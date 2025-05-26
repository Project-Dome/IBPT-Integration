/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @author Lucas Monaco - ProjectDome
 */

import { error } from 'N/log';
import { EntryPoints } from 'N/types';
import { createOrUpdateEstimatedTax } from '../UseCases/CreateOrUpdateEstimatedTaxes';
import { getAllItems } from '../UseCases/GetAllItems';
import { requestIBPT } from '../UseCases/RequestIBPT';
import * as Cache from 'N/cache';

export const getInputData: EntryPoints.MapReduce.getInputData = () => { 
    const teste = [getAllItems()[0]];
    return teste;
};

export const map: EntryPoints.MapReduce.map = (context) => {
    const estimatedTax = JSON.parse(context.value);

    try {
        const response = requestIBPT(estimatedTax);
        const isUpdated = estimatedTax.id == null;

        if (isUpdated) 
            createOrUpdateEstimatedTax(estimatedTax, response, estimatedTax.estimatedTaxId);
        else 
            createOrUpdateEstimatedTax(estimatedTax, response);
        
    } catch (e) {
        error({ title: 'Error in map stage', details: e });
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