/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Lucas Monaco - ProjectDome
*/

import * as Task from 'N/task';
import * as Log from 'N/log';
import * as Cache from 'N/cache';

export const post = (context: any) => {
    try {
        Log.debug('context', context);
        
        const estimatedTaxId = JSON.parse(context).estimatedTaxId;

        Log.debug('estimatedTaxId', estimatedTaxId);

        const updateIBPT = Task.create({
            taskType: Task.TaskType.MAP_REDUCE,
            scriptId: 'customscript_pd_ib_ibpt_integration_mr',
            deploymentId: 'customdeploy_pd_ib_ibpt_integ_mr_ns',
            params: {
                custscript_pd_ib_estimated_taxes_id: estimatedTaxId,
            },
        });
        const taskId = updateIBPT.submit();

        setCacheWithTaskId(taskId);

        return taskId;
    } catch (e) {
        return {
            error: true,
            message: 'Error in get method',
            details: e,
        }
    }
}

export const setCacheWithTaskId = (taskId: string)=> { 
    Log.debug('taskId', taskId);
    const cache = Cache.getCache({
        name: 'IBPTIntegration',
        scope: Cache.Scope.PUBLIC,
    });
    cache.put({
        key: 'taskId',
        value: taskId,
        ttl: 60 * 60 * 24,
    });
}
