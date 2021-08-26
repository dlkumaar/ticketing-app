import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';

import { json } from 'body-parser';
import { currentUserRouter } from './routes/currentUser';
import { signInRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';

const app = express();
app.use(json());

// mounted routes
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signupRouter);
app.use(signoutRouter);

// error handlers
app.use('*', () => {
	throw new NotFoundError();
});

app.use(errorHandler);

// db connection
const start = async () => {
	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		});
		console.log('connect to Mongo');
	} catch (err) {
		console.error(err);
	}
};

// start server
app.listen(3000, () => {
	console.log('Listening on port 3000!!!!');
	start();
});
