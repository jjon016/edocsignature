import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@edoccoding/common';
import { Signature } from '../models/signature';
import { SignaturesSetPublisher } from '../events/publisher/signatures-set-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/docs/setsignature',
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
    let Sig = await Signature.findById(req.currentUser!.id);
    let Updated = false;
    if (!Sig) {
      Sig = Signature.build({
        userid: req.currentUser!.id,
        signaturetype,
        signature,
        initialstype,
        initials,
      });
    } else {
      Updated = true;
      Sig.signaturetype = signaturetype;
      Sig.signature = signature;
      Sig.initialstype = initialstype;
      Sig.initials = initials;
    }
    await Sig.save();

    if (!Updated) {
      await new SignaturesSetPublisher(natsWrapper.client).publish({
        userid: Sig.userid,
      });
    }

    res.status(200).send({});
  }
);

export { router as setSigRouter };
