import { Request, Response } from 'express';
import { CredentialsInterface, UserInterface } from '../models/userModel';
import { MobileUserInterface, MobileCredentialsInterface } from '../models/modileUserModel';
let jwt = require('jsonwebtoken');

export class GenericController {

    constructor() { }

    generateToken(req: Request, res: Response) {
        let secret = process.env.secretkey;

        // let postData = JSON.parse(req.body);
        let postData: CredentialsInterface = req.body;
        // console.log(postData);
        let credentials = postData && postData.userName != "undefined" ? postData : null;
        if (credentials) {
            let token = jwt.sign({ username: credentials.userName },
                secret,
                {
                    expiresIn: '24h' // expires in 24 hours
                }
            );
            res.json({
                success: true,
                message: 'Authentication successful!',
                token: token
            });
        }
        else {
            res.send(403).json({
                success: false,
                message: 'Please provider user'
            });
        }


    }

    generateTokenForUser(user: UserInterface) {
        let secret = process.env.secretkey;
        let credentials = user.firstName != "undefined" ? user : null;
        if (credentials) {
            let token = jwt.sign({ username: credentials.firstName },
                secret,
                {
                    expiresIn: '365d'
                }
            );
            return token;
        }
        else {
            throw Error();
        }
    }
    generateMobileToken(req: Request, res: Response) {
        let secret = process.env.secretkey;

        // let postData = JSON.parse(req.body);
        let postData: MobileUserInterface = req.body;
        // console.log(postData);
        let credentials = postData && postData.fullName != "undefined" ? postData : null;
        if (credentials) {
            let token = jwt.sign({ username: credentials.fullName },
                secret,
                {
                    expiresIn: '24h' // expires in 24 hours
                }
            );
            res.json({
                success: true,
                message: 'Authentication successful!',
                token: token
            });
        }
        else {
            res.send(403).json({
                success: false,
                message: 'Please provider user'
            });
        }


    }
    generateTokenForMobileUser(user: MobileUserInterface) {
        let secret = process.env.secretkey;
        let credentials = user.fullName != "undefined" ? user : null;
        if (credentials) {
            let token = jwt.sign({ username: credentials.fullName },
                secret,
                {
                    expiresIn: '365d'
                }
            );
            return token;
        }
        else {
            throw Error();
        }
    }
}