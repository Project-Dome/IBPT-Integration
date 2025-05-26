/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
*/

import * as Search from 'N/search';

export const getParameterization = () => {
    const parametrization = Search.create({
        type: 'customrecord_pd_ib_parameterization',
        columns: [
            'custrecord_pd_ib_uf',
            'custrecord_pd_ib_access_token'
        ],
    }).run().getRange({ start: 0, end: 1 })[0];

    return {
        id: parametrization.id,
        uf: parametrization.getValue('custrecord_pd_ib_uf'),
        accessToken: parametrization.getValue('custrecord_pd_ib_access_token'),
    };
}
