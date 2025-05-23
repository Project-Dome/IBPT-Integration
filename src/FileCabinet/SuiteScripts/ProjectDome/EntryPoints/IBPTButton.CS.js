/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Lucas Monaco - ProjectDome
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
define(["require", "exports", "N/log", "N/url", "N/https", "N/ui/dialog"], function (require, exports, log, url, https, dialog) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateTaxesVersion = exports.pageInit = void 0;
    log = __importStar(log);
    url = __importStar(url);
    https = __importStar(https);
    dialog = __importStar(dialog);
    var pageInit = function (_context) {
    };
    exports.pageInit = pageInit;
    var updateTaxesVersion = function () {
        try {
            var restletUrl = url.resolveScript({
                scriptId: 'customscript_pd_ib_update_ibpt',
                deploymentId: 'customdeploy_pd_ib_update_ibpt',
            });
            log.debug('Restlet URL:', restletUrl);
            var response = https.get({
                url: restletUrl,
            });
            console.log('Response:', response);
            if (response.code > 199 && response.code < 301) {
                dialog.alert({
                    title: 'Aviso',
                    message: 'Integração de IBPT acionada com sucesso!',
                }).then(function () {
                    window.location.reload();
                });
            }
        }
        catch (e) {
            log.error({
                title: 'Erro ao acionar calculo do IBPT',
                details: e
            });
        }
    };
    exports.updateTaxesVersion = updateTaxesVersion;
});
