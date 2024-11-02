import * as jwt from "jsonwebtoken";

export interface JwtPayload {
    id: number;
    email: string;
}

export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '60d' });
}