/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @author Lucas Monaco - ProjectDome
 */

import { error } from 'N/log';
import * as log from 'N/log';
import { EntryPoints } from 'N/types';
import { updateEstimatedTax, getAllItems, createEstimatedTax, } from '../UseCases/UpdateEstimatedTaxes';
import { requestIBPT } from '../UseCases/RequestIBPT';
import * as nCache from 'N/cache';



export const getInputData: EntryPoints.MapReduce.getInputData = () => { 
    
    log.debug({
                title: 'Task ID',
                details: 'getInputData'
            });
    const teste = [getAllItems()[0]];
    return teste;
};

export const map: EntryPoints.MapReduce.map = (context) => {
    const estimatedTax = JSON.parse(context.value);
    try {
        const isUpdated = estimatedTax.id == null;
        const response = requestIBPT(estimatedTax);
        if (isUpdated) {
            updateEstimatedTax(estimatedTax.estimatedTaxId, response, estimatedTax);
        }else {
            createEstimatedTax(response,estimatedTax);
        }
        error('Response:', response);
    } catch (e) {
        error({ title: 'Error in map stage', details: e });
    }
};  

export const summarize: EntryPoints.MapReduce.summarize = (_context) => {
        const cache = nCache.getCache({
            name: "IBPTIntegration",
            scope: nCache.Scope.PUBLIC,
        });
        cache.remove({ 
            key: 'taskId' 
        });
}