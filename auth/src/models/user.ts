import mongoose from 'mongoose';
import { Password } from '../services/password';

interface UserAttrs {
	email: string;
	password: string;
}

// interface that describes the properties that a usermodel has
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// interface that describes the properties that a user document has
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

// user Schema
const userSchema = new mongoose.Schema({
	email: { type: String, required: true },
	password: {
		type: String,
		required: true,
	},
});

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const buildUser = (attrs: UserAttrs) => {
// 	return new User(attrs);
// };

// User.build({
// 	email: 'aa@gmail',
// 	password: '21111',
// });

export { User };
