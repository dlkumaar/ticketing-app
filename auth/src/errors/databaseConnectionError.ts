import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

export class DatabaseConnectionError extends CustomError {
	statusCode = 500;
	reason = 'Error connecting to database';

	constructor() {
		super('DB connection error');

		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	}

	serializeErrors() {
		return [{ message: this.reason }];
	}
}
