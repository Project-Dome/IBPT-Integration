/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
*/

import * as Log from 'N/log';
import * as Https from 'N/https';
import * as Runtime from 'N/runtime';

export const requestIBPT = (estimatedTax:any) => {
    let url = '';
    const token = 'WXhNNrk-2_LhprT3rlxA1L5tXasqHc6FDGs0r3A6NzMswTTt4YqyAnaK5XuDTljZ';
    const cnpj = String(Runtime.getCurrentScript().getParameter({ name: 'custscript_pd_ib_cnpj' }));

    if (estimatedTax.itemType === 'product') 
        url = buildProcuctUrl(estimatedTax, token, cnpj);
    else if (estimatedTax.itemType === 'service')
        url = buildServiceUrl(estimatedTax, token,cnpj);
    else 
        throw new Error(`Invalid item type (${estimatedTax.itemType})`);

    const response = Https.get({
        url: url,
    });

    if (response.code > 199 && response.code < 301) 
        return JSON.parse(response.body);
    else {
        Log.error({
            title: 'Error in IBPT request',
            details: `Error in IBPT request: ${url} - ${response.body}`,
        });
        throw new Error(`Error in IBPT request: ${response.code} - ${response.body}`);
    }
}

const buildProcuctUrl = (serviceData: any, token: string, cnpj:string) => {
    const measureUnit = 'UN'
    const ex = 0
    const valor = 0
    const gtin = 'SEMGTIN'
    const description = serviceData.description ? serviceData.description : 'Temp';
    const codigo = serviceData.itemCod.replace(/[^\d]/g, '');
    const uf = 'SP'
    
    const url = `https://apidoni.ibpt.org.br/api/v1/produtos?token=${encodeURIComponent(token)}&cnpj=${encodeURIComponent(cnpj)}&codigo=${encodeURIComponent(codigo)}&uf=${encodeURIComponent(uf)}&ex=${ex}&descricao=${encodeURIComponent(description)}&unidadeMedida=${encodeURIComponent(measureUnit)}&valor=${valor}&gtin=${encodeURIComponent(gtin)}&codigoInterno=0`

    return url;
}

const buildServiceUrl = (serviceData: any, token: string, cnpj: string) => {
    const measureUnit = 'UN'
    const valor = 0
    const description = serviceData.description ? serviceData.description : 'Temp';
    const codigo = serviceData.itemCod.replace(/[^\d]/g, '');

    const url = `https://apidoni.ibpt.org.br/api/v1/servicos?token=${encodeURIComponent(token)}&cnpj=${encodeURIComponent(cnpj)}&codigo=${encodeURIComponent(codigo)}&uf=${encodeURIComponent(serviceData.subsidiaryData.state)}&descricao=${encodeURIComponent(description)}&unidadeMedida=${encodeURIComponent(measureUnit)}&valor=${valor}&codigoInterno=0` 

    return url;
}
