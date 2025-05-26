/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Lucas Monaco - ProjectDome
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define(["require", "exports", "N/log", "N/url", "N/https", "N/ui/dialog"], function (require, exports, Log, URL, https, Dialog) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.updateTaxesVersion = exports.pageInit = void 0;
    Log = __importStar(Log);
    URL = __importStar(URL);
    https = __importStar(https);
    Dialog = __importStar(Dialog);
    var pageInit = function (_context) { };
    exports.pageInit = pageInit;
    var updateTaxesVersion = function () {
        try {
            var restletUrl = URL.resolveScript({
                scriptId: 'customscript_pd_ib_update_ibpt',
                deploymentId: 'customdeploy_pd_ib_update_ibpt',
            });
            var response = https.get({
                url: restletUrl,
            });
            if (response.code > 199 && response.code < 301) {
                Dialog.alert({
                    title: 'Aviso',
                    message: 'Integração de IBPT acionada com sucesso!',
                }).then(function () {
                    window.location.reload();
                });
            }
        }
        catch (e) {
            Log.error('updateTaxesVersion error', e);
        }
    };
    exports.updateTaxesVersion = updateTaxesVersion;
});
