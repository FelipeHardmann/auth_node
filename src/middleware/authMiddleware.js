"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (request, response, next) => {
    var _a;
    const token = (_a = request.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        // Retornando a resposta diretamente, sem chamar next()
        return response.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }
    try {
        // Verificando e decodificando o token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Atribuindo as informações decodificadas à request.user
        request.user = decoded;
        // Passando para o próximo middleware ou rota
        return next(); // Garantir que 'next' seja chamado corretamente
    }
    catch (error) {
        // Retornando a resposta diretamente, sem chamar next()
        return response.status(401).json({ error: 'Token inválido.' });
    }
};
exports.default = authMiddleware;
