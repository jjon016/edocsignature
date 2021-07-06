import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError } from '@edoccoding/common';
import { Doc } from '../models/doc';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get(
  '/api/docs/:docid',
  requireAuth,
  async (req: Request, res: Response) => {
    const theFile = path.join(__dirname, 'signings', req.params.docid + '.pdf');
    if (!fs.existsSync(theFile)) {
      throw new NotFoundError();
    }
    res.download(theFile);
  }
);

export { router as getDoc };
