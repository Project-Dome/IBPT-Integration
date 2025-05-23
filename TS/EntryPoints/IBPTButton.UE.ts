/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 *@author Lucas Monaco - ProjectDome
 */

import { EntryPoints } from 'N/types';
import { error } from "N/log";
import * as Message from 'N/ui/message';
import * as Cache from 'N/cache';
import * as Task from 'N/task';
 
export const beforeLoad: EntryPoints.UserEvent.beforeLoad = (context) => {
    try {
        const { form } = context;
        form.clientScriptModulePath = './IBPTButton.CS';

        const taskStatus = getStatus();
        
        if (taskStatus === 'Processing') 
            Message.create({
                title: "Aguarde",
                message: "Aguarde, o processo de atualização de impostos está em andamento.", 
                type: Message.Type.CONFIRMATION
            })
        else 
            form.addButton({
                id: 'custpage_ibpt_button',
                label: 'Atualizar Versão dos Impostos',
                functionName: 'updateTaxesVersion',
            });
    } catch (e) {
        error('beforeLoad error', e);
    }  
};

const getStatus = () => {
    const cache = Cache.getCache({
        name: "IBPTIntegration",
        scope: Cache.Scope.PUBLIC,
    });

    const taskId = cache.get({ key: 'taskId' });

    if (!taskId) return '';
    
    return String(Task.checkStatus({ taskId: taskId }));
}
