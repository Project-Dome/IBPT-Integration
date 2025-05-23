/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
*/

import * as Search from 'N/search';
import * as record from 'N/record';
import { error } from 'N/log';


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

export const updateTaskId = (response: any, id: string) => {

    var objRecord = record.load({
            type: 'customrecord_pd_ib_parameterization',
            id: id,
        });

    error('SetValue', response.taskId);
    objRecord.setValue({
        fieldId: 'custrecord_pd_ib_taskid',
        value: response.taskId,
    });

    objRecord.save();
}