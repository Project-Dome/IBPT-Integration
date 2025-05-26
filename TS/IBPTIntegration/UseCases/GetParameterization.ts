/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
*/

import * as Search from 'N/search';

export const getParameterization = () => {
    const subsidiary = Search.create({
        type: 'customrecord_pd_ib_parameterization',
        columns: ['customrecord_pd_ib_uf'],
    }).run().getRange({ start: 0, end: 1 })[0];

    return {
        uf: subsidiary.getValue({ name: 'customrecord_pd_ib_uf' }),
        id: subsidiary.id,
    };
}
