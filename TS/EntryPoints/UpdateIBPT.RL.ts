/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Lucas Monaco - ProjectDome
*/

import { EntryPoints } from 'N/types';
import * as task from 'N/task';
import * as log from 'N/log';
import * as nCache from 'N/cache';


export const get = (_context: EntryPoints.RESTlet.get) => {
    try {
        const updateIBPT = task.create({
            taskType: task.TaskType.MAP_REDUCE,
            scriptId: 'customscript_pd_ib_ibpt_integration_mr',
            deploymentId: 'customdeploy_pd_ib_ibpt_integ_mr_ns',
        });
        const taskId = updateIBPT.submit();

        setCacheWithTaskId(taskId);

        log.debug({
            title: 'Task ID',
            details: taskId
        });

        return taskId

    } catch (e) {
        return {
            error: true,
            message: 'Error in get method',
            details: e,
        }
    }
}

export const setCacheWithTaskId = (taskId:string)=> {
    const cache = nCache.getCache({
        name: "IBPTIntegration",
        scope: nCache.Scope.PUBLIC,
    });
    cache.put({
        key: 'taskId',
        value: taskId,
        ttl: 60 * 60 * 24,
    });
}
