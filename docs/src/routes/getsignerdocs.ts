import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, DocStatus } from '@edoccoding/common';
import { Doc } from '../models/doc';

const router = express.Router();

router.get(
  '/api/docs/signerdocs/',
  requireAuth,
  async (req: Request, res: Response) => {
    let docs = null;
    docs = await Doc.find({
      ownerid: req.currentUser!.id,
    });
    res.send({ docs: docs });
  }
);

export { router as getSignerDocs };
