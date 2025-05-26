/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
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
define(["require", "exports", "N/log", "N/https", "N/runtime"], function (require, exports, Log, Https, Runtime) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.requestIBPT = void 0;
    Log = __importStar(Log);
    Https = __importStar(Https);
    Runtime = __importStar(Runtime);
    var requestIBPT = function (estimatedTax) {
        var url = '';
        var cnpj = String(Runtime.getCurrentScript().getParameter({ name: 'custscript_pd_ib_cnpj' }));
        if (estimatedTax.itemType === 'product')
            url = buildProcuctUrl(estimatedTax, cnpj);
        else if (estimatedTax.itemType === 'service')
            url = buildServiceUrl(estimatedTax, cnpj);
        else
            throw new Error("Invalid item type (" + estimatedTax.itemType + ")");
        var response = Https.get({
            url: url,
        });
        if (response.code > 199 && response.code < 301)
            return JSON.parse(response.body);
        else {
            Log.error({
                title: 'Error in IBPT request',
                details: "Error in IBPT request: " + url + " - " + response.body,
            });
            throw new Error("Error in IBPT request: " + response.code + " - " + response.body);
        }
    };
    exports.requestIBPT = requestIBPT;
    var buildProcuctUrl = function (productData, cnpj) {
        var measureUnit = 'UN';
        var ex = 0;
        var valor = 0;
        var gtin = 'SEMGTIN';
        var description = productData.description ? productData.description : 'Temp';
        var codigo = productData.itemCod.replace(/[^\d]/g, '');
        var uf = productData.uf;
        var url = "https://apidoni.ibpt.org.br/api/v1/produtos?token=" + encodeURIComponent(productData.accessToken) + "&cnpj=" + encodeURIComponent(cnpj) + "&codigo=" + encodeURIComponent(codigo) + "&uf=" + encodeURIComponent(uf) + "&ex=" + ex + "&descricao=" + encodeURIComponent(description) + "&unidadeMedida=" + encodeURIComponent(measureUnit) + "&valor=" + valor + "&gtin=" + encodeURIComponent(gtin) + "&codigoInterno=0";
        return url;
    };
    var buildServiceUrl = function (serviceData, cnpj) {
        var measureUnit = 'UN';
        var valor = 0;
        var description = serviceData.description ? serviceData.description : 'Temp';
        var codigo = serviceData.itemCod.replace(/[^\d]/g, '');
        var uf = serviceData.uf;
        var url = "https://apidoni.ibpt.org.br/api/v1/servicos?token=" + encodeURIComponent(serviceData.accessToken) + "&cnpj=" + encodeURIComponent(cnpj) + "&codigo=" + encodeURIComponent(codigo) + "&uf=" + encodeURIComponent(uf) + "&descricao=" + encodeURIComponent(description) + "&unidadeMedida=" + encodeURIComponent(measureUnit) + "&valor=" + valor + "&codigoInterno=0";
        return url;
    };
});
