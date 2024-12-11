"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const routes = (0, express_1.Router)();
// Rota de registro não precisa de autenticação
routes.post('/register', UserController_1.UserController.register);
// Rota de login não precisa de autenticação
routes.post('/login', UserController_1.UserController.login);
// Rotas protegidas que precisam de autenticação
routes.get('/user/:id', authMiddleware_1.default, UserController_1.UserController.getUser);
routes.delete('/user/:id', authMiddleware_1.default, UserController_1.UserController.deleteUser);
exports.default = routes;
