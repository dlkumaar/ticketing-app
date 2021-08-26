import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/requestValidationError';
import { BadRequestError } from '../errors/badRequestError';

import { User } from '../models/user';

const router = express.Router();
router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be a valid email'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be provided'),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		const { email, password } = req.body;

		const existingUser = await User.findOne({ email: email });

		if (existingUser) {
			console.log('Email in use');
			throw new BadRequestError('Email already in use');
		}

		const user = User.build({ email, password });
		await user.save();

		res.status(201).send(user);
	}
);

router.get('/api/users/signup', async (req: Request, res: Response) => {
	const user = await User.find();
	res.send({ user });
});
export { router as signupRouter };
