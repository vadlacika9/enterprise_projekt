import { UserRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const userRepo = new UserRepository();

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error('CRITICAL ERROR: JWT_SECRET missing from .env file!');
}

export const ROLES = {
  RENTER: 'RENTER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN'
};

export class UserService {
  async getAllUsers() {
    return await userRepo.findAll();
  }

  async getUserById(id: number) {
    const user = await userRepo.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  private async sendWelcomeEmail(email: string, name: string) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@test.com',
        to: email,
        subject: 'Sikeres regisztracio!',
        text: `Kedves ${name}!\n\nKöszönjük, hogy regisztráltál a rendszerünkbe.\n\nÜdvözlettel:\nA Csapat`
      });

      // console.log(`[EMAIL SENT]: Sending email here: ${email} | Subject: Succesfull registration | Message: Hello ${name}!`);
    } catch (error) {
      console.error('[EMAIL ERROR]: Could not send email.', error)
    }
  }

  async register(userData: any) {
    const existingUser = await userRepo.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered!');
    }

    // console.log(userData);
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const userToCreate = {
      ...userData,
      password: hashedPassword,
      role: userData.role || ROLES.RENTER
    }

    const newUser = await userRepo.create(userToCreate);

    this.sendWelcomeEmail(newUser.email, newUser.first_name).catch((err) => {
      console.error("Error during email sending:", err);
    });

    return newUser;
  }

  async login(email: string, pass: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Wrong email or password!');
    }

    const isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) {
      throw new Error('Wrong email or password!');
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
        email: user.email
      },
      SECRET_KEY!,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user.user_id,
        email: user.email,
        name: user.first_name,
        role: user.role
      }
    };
  }
}