import express, { Request, Response } from 'express';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  BadRequestError,
  DocStatus,
} from '@edoccoding/common';
import { body } from 'express-validator';
import { Doc } from '../models/doc';
import mongoose from 'mongoose';

const router = express.Router();

router.post(
  '/api/docs/',
  requireAuth,
  [
    body('docname')
      .not()
      .isEmpty()
      .withMessage('Document name must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //Build the order and save it to the database
    const doc = Doc.build({
      docId: mongoose.Types.ObjectId().toHexString(),
      docName: req.body.docname,
      ownerId: req.body.ownerid,
      docStatus: req.body.docstatus,
      sigBoxes: req.body.sigboxes,
    });
    await doc.save();

    res.status(201).send({});
  }
);

export { router as newDocRouter };
