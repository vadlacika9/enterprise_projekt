// 1. JAVÍTÁS: "import type" használata a TypeScript szigorú módja miatt
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

const SECRET_KEY = process.env.JWT_SECRET || 'titkos_kulcs_ha_nincs_env';

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // A return fontos, hogy ne fusson tovább a kód
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    try {
        // 2. JAVÍTÁS: "as string" - megmondjuk neki, hogy ez biztosan szöveg
        const verified = jwt.verify(token, SECRET_KEY as string);
        req.user = verified; 
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};

export const requireRole = (role: string) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
            return;
        }
        next();
    };
};