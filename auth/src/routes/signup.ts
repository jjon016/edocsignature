import express, { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@edoccoding/common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('name')
      .trim()
      .isLength({ min: 4, max: 60 })
      .withMessage('Name must be between 4 and 60 characters'),
    body('initials')
      .trim()
      .isLength({ min: 2, max: 5 })
      .withMessage('Name must be between 2 and 5 characters'),
    body('phone').isLength({ min: 10, max: 10 }).withMessage('Invalid phone'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, name, initials, phone, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password, name, phone, initials });
    await user.save();

    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        initials: user.initials,
        phone: user.phone,
        signatureset: user.signatureset,
      },
      process.env.JWTKEY!
    );

    //Store it on session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
