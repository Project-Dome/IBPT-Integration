/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Lucas Monaco
 */

import * as task from 'N/task';
import * as nCache from 'N/cache';
 
export function get() {
    const taskId = getTaskId();

    if (!taskId) 
        return {   
            status:''
        };
        
    const statusObj = task.checkStatus({ taskId });

    return {
        status: statusObj.status
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