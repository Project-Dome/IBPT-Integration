/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 *@author Lucas Monaco - ProjectDome
 */

import { EntryPoints } from 'N/types';
import { debug } from "N/log";
import * as message from 'N/ui/message';
import * as nCache from 'N/cache';
import * as task from 'N/task';


 
export const beforeLoad: EntryPoints.UserEvent.beforeLoad = (context) => {
     try {
        const { form } = context;

        const getStatus = () => {
            const cache = nCache.getCache({
                name: "IBPTIntegration",
                scope: nCache.Scope.PUBLIC,
            });
            const taskId = cache.get({ key: 'taskId' });
            debug('Task ID:', taskId);
            if (!taskId) {
                return '';
            }
            return String(task.checkStatus({ taskId: taskId }));
        }
        const taskStatus = getStatus();
        debug('Task ID:', getStatus());
        debug('Task Status:', taskStatus);

        form.clientScriptModulePath = './IBPTButton.CS';
        
        if (taskStatus === 'Processing') {
            message.create({
                title: "Aguarde",
                message: "Aguarde, o processo de atualização de impostos está em andamento.", 
                type: message.Type.CONFIRMATION
            })
        }else{
            form.addButton({
                id: 'custpage_ibpt_button',
                label: 'Atualizar Versão dos Impostos',
                functionName: 'updateTaxesVersion',
            });
        }
        
    } catch (e) {
        debug({ title: 'Erro no beforeLoad', details: e });
    }
    
};

