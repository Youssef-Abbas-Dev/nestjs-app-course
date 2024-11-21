import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        // const token = req.headers.authorization;
        // if(token && token === 'thisIsAToken'){
        //     next();
        // } else {
        //     res.status(401).json({ message: 'you are not allowed' });
        // }

        next();
    }
}