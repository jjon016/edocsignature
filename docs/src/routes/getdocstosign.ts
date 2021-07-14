import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@edoccoding/common';
import { Doc } from '../models/doc';

const router = express.Router();

router.get(
  '/api/docs/tosign',
  requireAuth,
  async (req: Request, res: Response) => {
    let doc = null;
    try {
      doc = await Doc.find({ 'signers.signerid': req.currentUser!.id });
    } catch {
      throw new NotFoundError();
    }
    res.send(doc);
  }
);

export { router as getDocsToSign };
