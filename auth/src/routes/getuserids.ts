import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, BadRequestError } from '@edoccoding/common';
import { User } from '../models/user';
import { TempUser } from '../models/tempuser';

const router = express.Router();

router.post(
  '/api/users/getuserids',
  requireAuth,
  async (req: Request, res: Response) => {
    const { emails } = req.body;
    var theids: Object[] = [];

    const Users = await User.find({ email: { $in: emails } });
    const TempUsers = await TempUser.find({ email: { $in: emails } });

    if (Users) {
      Users.map((user) => {
        theids.push({ id: user.id, email: user.email });
      });
    }
    if (TempUsers) {
      TempUsers.map((user) => {
        theids.push({ id: user.id, email: user.email });
      });
    }

    res.send(theids);
  }
);

export { router as getUserIDsRouter };
