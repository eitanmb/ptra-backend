import express from 'express';
import { whiteList } from '../config/whitelist';

export const credentials = (req:express.Request, res:express.Response, next: () => void) => {
    const origin = req.headers.origin;

    
    if (whiteList.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
}