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
 
export const beforeLoad: EntryPoints.UserEvent.beforeLoad = (context: EntryPoints.UserEvent.beforeLoadContext ) => {
    try {
        const { form } = context;
        
        form.clientScriptModulePath = './IBPTButton.CS';

        const taskStatus = getStatus();

        if (taskStatus === Task.TaskStatus.PROCESSING) 
            form.addPageInitMessage({
                type: Message.Type.INFORMATION,
                title: 'Atualização em andamento',
                message: 'A atualização dos impostos está em andamento. Por favor, aguarde a conclusão.',
            });
        else 
            form.addButton({
                id: 'custpage_ibpt_button',
                label: 'Atualizar Versão dos Impostos',
                functionName: 'updateTaxesVersion(' +context.newRecord.id+ ')',
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

    const taskStatus = Task.checkStatus({ taskId: taskId })

    return String(taskStatus.status);
}
