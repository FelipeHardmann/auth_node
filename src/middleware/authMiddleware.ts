import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definindo o tipo para 'user' na Request para evitar erros de tipagem
declare global {
  namespace Express {
    interface Request {
      user?: any; // Aqui estamos assumindo que o `decoded` será do tipo 'any'
    }
  }
}

const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const token = request.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // Retornando a resposta diretamente, sem chamar next()
    return response.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    // Verificando e decodificando o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Atribuindo as informações decodificadas à request.user
    request.user = decoded;

    // Passando para o próximo middleware ou rota
    return next(); // Garantir que 'next' seja chamado corretamente
  } catch (error) {
    // Retornando a resposta diretamente, sem chamar next()
    return response.status(401).json({ error: 'Token inválido.' });
  }
};

export default authMiddleware;
