import express, { Request, Response } from 'express';
import { requireAuth, BadRequestError, DocStatus } from '@edoccoding/common';
import { isDoc } from '../models/doc-validation';
import { Doc } from '../models/doc';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/docs/', requireAuth, async (req: Request, res: Response) => {
  const _id = mongoose.Types.ObjectId().toHexString();
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.FILE) {
    return res.status(400).send('No files uploaded');
  }
  if ((req.files.FILE as any).mimetype != 'application/pdf') {
    return res.status(401).send('Invalid file uploaded');
  }
  const uploadPath = path.join(__dirname, 'signings');
  const fileName = _id + '.pdf';
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }
  (req.files.FILE as any).mv(
    path.join(uploadPath, fileName),
    function (err: any) {
      if (err) return res.status(500).send(err);
    }
  );

  const theJSON = JSON.parse(req.body.JSON);

  if (!isDoc(theJSON)) {
    throw new BadRequestError('Invalid data in request');
  }

  const doc = Doc.build({
    _id,
    docname: theJSON.docname,
    ownerid: theJSON.ownerid || req.currentUser!.id,
    docstatus: theJSON.docstatus || DocStatus.Signing,
    sigboxes: theJSON.sigboxes || [],
    signers: theJSON.signers || [],
  });

  await doc.save();
  res.status(201).send(doc);
});

export { router as newDocRouter };
