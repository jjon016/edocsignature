import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { requireAuth, NotFoundError } from '@edoccoding/common';

const router = express.Router();

router.get(
  '/api/users/mydata',
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.currentUser!.id;
    console.log('looking up data for: ' + id);
    let user = null;
    try {
      user = await User.findById(id);
    } catch {
      throw new NotFoundError();
    }

    console.log(user);

    res.send(user);
  }
);

export { router as getDataRouter };
