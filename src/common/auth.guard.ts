import { IMiddleware } from './middleware.interface';
import { NextFunction, Response, Request } from 'express';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'Not authorized' });
	}
}
