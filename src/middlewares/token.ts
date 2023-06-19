let jwt = require('jsonwebtoken');
import { Response, NextFunction } from 'express';
export function checkToken(req: any, res: Response, next: NextFunction) {
    let token = req.headers && req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token && token.startsWith('Bearer')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    let secret = process.env.secretkey;
    if (token) {
        jwt.verify(token, secret, (err: any, decoded: any) => {
            if (err) {
                res.json({
                    responseCode: 0,
                    responseStatus: 'error',
                    responseMessage: 'Token is not valid',
                    data: {}
                });
            }
            else {
                req.decoded = decoded;
                // console.log('decoded');
                // console.log(decoded);
                // return {
                //     responseCode: 1,
                //     responseStatus: 'success',
                //     responseMessage: 'Token verified sccussfully',
                //     data: { verifiedToken: decoded }
                // };
                next();
            }
        });
    }
    else {
        res.json({
            responseCode: 0,
            responseStatus: 'error',
            responseMessage: 'Auth token is not supplied',
            data: {}
        });
    }
};
