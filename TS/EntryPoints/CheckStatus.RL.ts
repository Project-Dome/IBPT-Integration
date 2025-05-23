/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Lucas Monaco
 */

import * as task from 'N/task';
import { debug } from 'N/log';
import * as nCache from 'N/cache';
 
 
export function get() {

    const taskId = getTaskId();
    debug('Task  checkstatus:', taskId);
    if (taskId) {
        const statusObj = task.checkStatus({ taskId });
        debug('Status:', statusObj.status);
        return {
            status: statusObj.status
        };
    }
    return {   
        status:''
    };
}

const getTaskId = () => {
    const cache = nCache.getCache({
        name: "IBPTIntegration",
        scope: nCache.Scope.PUBLIC,
    });
    const taskId = cache.get({ key: 'taskId' });
    return taskId;
}