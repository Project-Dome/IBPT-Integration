/**
*@NApiVersion 2.1
 @author Lucas Monaco - ProjectDome
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
define(["require", "exports", "N/https", "N/log", "N/runtime"], function (require, exports, Https, log_1, Runtime) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.requestIBPT = void 0;
    Https = __importStar(Https);
    Runtime = __importStar(Runtime);
    var requestIBPT = function (estimatedTax) {
        var url = '';
        var token = 'WXhNNrk-2_LhprT3rlxA1L5tXasqHc6FDGs0r3A6NzMswTTt4YqyAnaK5XuDTljZ';
        var cnpj = String(Runtime.getCurrentScript().getParameter({ name: 'custscript_pd_ib_cnpj' }));
        if (estimatedTax.itemType === 'product') {
            url = buildProcuctsUrl(estimatedTax, token, cnpj);
        }
        else if (estimatedTax.itemType === 'service') {
            url = buildServicesUrl(estimatedTax, token, cnpj);
        }
        else {
            throw new Error('Invalid item type.');
        }
        var response = Https.get({
            url: url,
        });
        (0, log_1.error)('url', url);
        if (response.code > 199 && response.code < 301) {
            return JSON.parse(response.body);
        }
        else {
            throw new Error("Error in IBPT request: ".concat(response.code, " - ").concat(response.body));
        }
    };
    exports.requestIBPT = requestIBPT;
    var buildProcuctsUrl = function (serviceData, token, cnpj) {
        var measureUnit = 'UN';
        var ex = 0;
        var valor = 0;
        var gtin = 'SEMGTIN';
        var description = serviceData.description ? serviceData.description : 'teste';
        var codigo = serviceData.itemCod.replace(/[^\d]/g, '');
        var uf = 'SP';
        var url = "https://apidoni.ibpt.org.br/api/v1/produtos?token=".concat(encodeURIComponent(token), "&cnpj=").concat(encodeURIComponent(cnpj), "&codigo=").concat(encodeURIComponent(codigo), "&uf=").concat(encodeURIComponent(uf), "&ex=").concat(ex, "&descricao=").concat(encodeURIComponent(description), "&unidadeMedida=").concat(encodeURIComponent(measureUnit), "&valor=").concat(valor, "&gtin=").concat(encodeURIComponent(gtin), "&codigoInterno=0");
        return url;
    };
    var buildServicesUrl = function (serviceData, token, cnpj) {
        var measureUnit = 'UN';
        var valor = 0;
        var description = serviceData.description ? serviceData.description : 'teste';
        var codigo = serviceData.itemCod.replace(/[^\d]/g, '');
        var url = "https://apidoni.ibpt.org.br/api/v1/servicos?token=".concat(encodeURIComponent(token), "&cnpj=").concat(encodeURIComponent(cnpj), "&codigo=").concat(encodeURIComponent(codigo), "&uf=").concat(encodeURIComponent(serviceData.subsidiaryData.state), "&descricao=").concat(encodeURIComponent(description), "&unidadeMedida=").concat(encodeURIComponent(measureUnit), "&valor=").concat(valor, "&codigoInterno=0");
        return url;
    };
});
