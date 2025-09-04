/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Lucas Monaco - ProjectDome
*/

import { EntryPoints } from 'N/types';
import * as Log from 'N/log';
import * as URL from 'N/url';
import * as https from 'N/https';
import * as Dialog from 'N/ui/dialog';

export const pageInit = (_context: EntryPoints.Client.pageInit) => { }

<<<<<<< HEAD
export const updateTaxesVersion = (estimatedTaxId: string) => {
=======
export const updateTaxesVersion = () => {
    
>>>>>>> 236111af0ab2b8d6e9667f57dddb9be29f535242
    try {

        const restletUrl = URL.resolveScript({
            scriptId: 'customscript_pd_ib_update_ibpt',
            deploymentId: 'customdeploy_pd_ib_update_ibpt',
        });

        console.log('estimatedTaxId', estimatedTaxId)

        const response = https.post({
            body: JSON.stringify({
                estimatedTaxId: estimatedTaxId,
            }),
            url: restletUrl,
        })

        if (response.code > 199 && response.code < 301) {
            Dialog.alert({
                title: 'Aviso',
                message: 'Integração de IBPT acionada com sucesso!',
            }).then(() => {
                window.location.reload();
            });
        }

    } catch (e) {
        Log.error('updateTaxesVersion error', e);
    }
}