import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Incorrect email' })
	email: string;

	@IsString({ message: 'Password not send' })
	password: string;

	@IsString({ message: 'Name not send' })
	name: string;
}
