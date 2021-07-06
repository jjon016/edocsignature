import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
} from '@edoccoding/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/setsignature',
  requireAuth,
  [
    body('signaturetype')
      .trim()
      .notEmpty()
      .withMessage('Signature type not set'),
    body('signature').trim().notEmpty().withMessage('Signature not set'),
    body('initialstype').trim().notEmpty().withMessage('Initials type not set'),
    body('initials').trim().notEmpty().withMessage('Initials not set'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { signaturetype, signature, initialstype, initials } = req.body;
    const existingUser = await User.findById(req.currentUser!.id);
    if (!existingUser) {
      throw new NotFoundError();
    }
    existingUser.signaturetype = signaturetype;
    existingUser.signature = signature;
    existingUser.initialstype = initialstype;
    existingUser.initials = initials;
    await existingUser.save();
    res.status(200).send(existingUser);
  }
);

export { router as setSigRouter };
