import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { DocAttrs } from '../../models/doc';
import { SigBoxType, DocStatus } from '@edoccoding/common';
import { SigBoxAttrs, SigBox } from '../../models/sigbox';

const randomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const testUploadFile = path.join(__dirname, '\\test.pdf');

export const cleanDirectories = () => {
  const theDir = path.join(__dirname, '../signings');
  fs.readdir(theDir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(theDir, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

export const buildValidSigBoxAttrsObj = () => {
  const sigboxAttrs: SigBoxAttrs = {
    x: randomFloat(10, 80),
    y: randomFloat(10, 80),
    width: randomFloat(5, 20),
    height: randomFloat(2, 10),
    signerid: mongoose.Types.ObjectId().toHexString(),
    type: SigBoxType.Signature,
    value: '',
  };
  return sigboxAttrs;
};

export const buildValidDocAttrsObj = (docid?: string, ownerid?: string) => {
  const docAttrs: DocAttrs = {
    docid: docid || mongoose.Types.ObjectId().toHexString(),
    docname: 'A test document',
    ownerid: ownerid || mongoose.Types.ObjectId().toHexString(),
    docstatus: DocStatus.Signing,
    sigboxes: [],
  };
  docAttrs.sigboxes.push(new SigBox(buildValidSigBoxAttrsObj()));
  docAttrs.sigboxes.push(new SigBox(buildValidSigBoxAttrsObj()));
  docAttrs.sigboxes.push(new SigBox(buildValidSigBoxAttrsObj()));
  return docAttrs;
};

export const testValidDocObject = (docid?: string, ownerid?: string) => {
  return {
    docname: 'Test Doc',
    docid: docid || mongoose.Types.ObjectId().toHexString(),
    ownerid: ownerid || mongoose.Types.ObjectId().toHexString(),
    docstatus: DocStatus.Signing,
    sigboxes: [
      {
        x: 2.222,
        y: 2.22,
        width: 2.22,
        height: 2.22,
        signerid: mongoose.Types.ObjectId().toHexString(),
        type: SigBoxType.Signature,
        value: '',
      },
      {
        x: 3.222,
        y: 3.22,
        width: 3.22,
        height: 3.22,
        signerid: mongoose.Types.ObjectId().toHexString(),
        type: SigBoxType.Signature,
        value: '',
      },
    ],
  };
};
