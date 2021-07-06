import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { DocAttrs } from '../../models/doc';
import { SigBoxType, DocStatus } from '@edoccoding/common';

export const randomFloat = (min: number, max: number) => {
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

export const testValidDocObject = (docid?: string, ownerid?: string) => {
  return {
    docname: 'Test Doc',
    docid: docid || mongoose.Types.ObjectId().toHexString(),
    ownerid: ownerid || mongoose.Types.ObjectId().toHexString(),
    docstatus: DocStatus.Signing,
    sigboxes: [
      {
        x: randomFloat(5, 70),
        y: randomFloat(5, 70),
        width: randomFloat(5, 70),
        height: randomFloat(5, 70),
        signerid: mongoose.Types.ObjectId().toHexString(),
        type: SigBoxType.Signature,
        value: '',
      },
      {
        x: randomFloat(5, 70),
        y: randomFloat(5, 70),
        width: randomFloat(5, 70),
        height: randomFloat(5, 70),
        signerid: mongoose.Types.ObjectId().toHexString(),
        type: SigBoxType.Initials,
        value: '',
      },
    ],
  };
};
