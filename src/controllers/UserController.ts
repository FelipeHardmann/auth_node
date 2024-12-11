import { Request, Response } from "express";
import { prisma } from "../database";
import { generateToken } from "../utils/generateToken";
import bcrypt from "bcrypt";

export const UserController = {
  async register(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    try {
      const userExists = await prisma.user.findUnique({ where: { email } });

      if (userExists) {
        return response.status(400).json({ error: "Usuário já existe." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      return response.status(201).json({ message: "Usuário criado com sucesso!", user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
      return response.status(500).json({ error: errorMessage });
    }
  },

  async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return response.status(401).json({ error: "Email ou senha inválidos." });
      }

      const token = generateToken(user.id);

      return response.json({ message: "Login realizado com sucesso!", token });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
      return response.status(500).json({ error: errorMessage });
    }
  },

  async getUser(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });

      if (!user) {
        return response.status(404).json({ error: "Usuário não encontrado." });
      }

      return response.json(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
      return response.status(500).json({ error: errorMessage });
    }
  },

  async deleteUser(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    try {
      const user = await prisma.user.delete({ where: { id: Number(id) } });

      return response.json({ message: "Usuário deletado com sucesso!", user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido.";
      return response.status(500).json({ error: errorMessage });
    }
  },
};
