import { Router } from "express";
import { UserController } from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";

const routes = Router();

// Rota de registro não precisa de autenticação
routes.post('/register', UserController.register);

// Rota de login não precisa de autenticação
routes.post('/login', UserController.login);

// Rotas protegidas que precisam de autenticação
routes.get('/user/:id', authMiddleware, UserController.getUser);
routes.delete('/user/:id', authMiddleware, UserController.deleteUser);


export default routes;
