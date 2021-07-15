import express, { Request, Response } from 'express';
import validator from 'validator';
import { Doc, SignerAttrs, SigBoxAttrs } from '../models/doc';
import { isSigBox, isSigner } from '../models/doc-validation';
import { BadRequestError, requireAuth } from '@edoccoding/common';

const router = express.Router();

router.post(
  '/api/docs/update',
  requireAuth,
  async (req: Request, res: Response) => {
    let { id, docname, signers, sigboxes } = req.body;

    const aDoc = await Doc.findById(id);

    if (!aDoc) {
      throw new BadRequestError('Document not found');
    }

    if (docname) {
      docname = validator.trim(docname);
      if (!validator.isLength(docname, { min: 6, max: 64 })) {
        throw new BadRequestError(
          'Document name must be between 6 and 64 characters'
        );
      }
      aDoc.docname = docname;
    }

    if (signers) {
      signers.map((signer: SignerAttrs) => {
        if (!isSigner(signer)) {
          throw new BadRequestError('Invalid signer data');
        }
      });
      aDoc.signers = signers;
    }

    if (sigboxes) {
      sigboxes.map((box: SigBoxAttrs) => {
        if (!isSigBox(box)) {
          throw new BadRequestError('Invalid signature box data');
        }
      });
      aDoc.sigboxes = sigboxes;
    }

    console.log('saving changes');

    await aDoc.save();

    res.status(200).send({});
  }
);

export { router as updateDocRouter };
