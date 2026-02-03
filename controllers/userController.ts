import { type Request, type Response } from 'express';
import { UserService } from '../services/userService.js';

const userService = new UserService();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const newUser = await userService.register(req.body);

    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await userService.login(email, password);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};