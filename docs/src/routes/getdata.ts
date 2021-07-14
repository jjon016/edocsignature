import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@edoccoding/common';
import { Doc } from '../models/doc';

const router = express.Router();

router.get(
  '/api/docs/data/:docid',
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.docid;
    let doc = null;
    try {
      doc = await Doc.findById(id);
    } catch {
      throw new NotFoundError();
    }

    res.send(doc);
  }
);

export { router as getDocData };
