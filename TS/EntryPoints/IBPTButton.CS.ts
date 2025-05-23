/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Lucas Monaco - ProjectDome
*/

import * as log from 'N/log';
import * as url from 'N/url';
import * as https from 'N/https';
import { EntryPoints } from 'N/types';
import * as dialog from 'N/ui/dialog';

export const pageInit = (_context: EntryPoints.Client.pageInit) => {

}

export const updateTaxesVersion = () => {
    try {
        const restletUrl = url.resolveScript({
            scriptId: 'customscript_pd_ib_update_ibpt',
            deploymentId: 'customdeploy_pd_ib_update_ibpt',
        });
        log.debug('Restlet URL:', restletUrl);

        const response = https.get({
            url: restletUrl,
        })
        console.log('Response:', response);

        if (response.code > 199 && response.code < 301) {

            dialog.alert({
                title: 'Aviso',
                message: 'Integração de IBPT acionada com sucesso!',
            }).then(() => {
                window.location.reload();
            });
        }

    }catch (e) {
        log.error({
            title: 'Erro ao acionar calculo do IBPT',
            details: e
        });
    }
}