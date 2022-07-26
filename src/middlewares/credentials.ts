import express from 'express';
import { whitelist } from '../config/whitelist';

export const credentials = (req:express.Request, res:express.Response, next: () => void) => {
    const origin = req.headers.origin;
    if (origin && whitelist.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
}