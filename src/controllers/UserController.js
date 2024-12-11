"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const database_1 = require("../database");
const generateToken_1 = require("../utils/generateToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.UserController = {
    register(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = request.body;
            try {
                const userExists = yield database_1.prisma.user.findUnique({ where: { email } });
                if (userExists) {
                    return response.status(400).json({ error: "Usuário já existe." });
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const user = yield database_1.prisma.user.create({
                    data: { name, email, password: hashedPassword },
                });
                return response.status(201).json({ message: "Usuário criado com sucesso!", user });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
                return response.status(500).json({ error: errorMessage });
            }
        });
    },
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            try {
                const user = yield database_1.prisma.user.findUnique({ where: { email } });
                if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
                    return response.status(401).json({ error: "Email ou senha inválidos." });
                }
                const token = (0, generateToken_1.generateToken)(user.id);
                return response.json({ message: "Login realizado com sucesso!", token });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
                return response.status(500).json({ error: errorMessage });
            }
        });
    },
    getUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            try {
                const user = yield database_1.prisma.user.findUnique({ where: { id: Number(id) } });
                if (!user) {
                    return response.status(404).json({ error: "Usuário não encontrado." });
                }
                return response.json(user);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
                return response.status(500).json({ error: errorMessage });
            }
        });
    },
    deleteUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            try {
                const user = yield database_1.prisma.user.delete({ where: { id: Number(id) } });
                return response.json({ message: "Usuário deletado com sucesso!", user });
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
                return response.status(500).json({ error: errorMessage });
            }
        });
    },
};
