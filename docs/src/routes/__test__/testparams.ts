import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { DocAttrs, Doc } from '../../models/doc';
import { Signature } from '../../models/signature';
import { SigBoxType, DocStatus, FontTypes } from '@edoccoding/common';

export const randomFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const buildSig = async (
  userid?: string,
  name?: string,
  initials?: string,
  sigtype?: FontTypes,
  inittype?: FontTypes
) => {
  const sig = Signature.build({
    userid: userid || mongoose.Types.ObjectId().toHexString(),
    signaturetype: sigtype || FontTypes.AlluraRegular,
    signature: name || 'Test User',
    initialstype: inittype || FontTypes.AlluraRegular,
    initials: initials || 'TU',
    userversion: 0,
  });
  await sig.save();
  return sig;
};

export const buildDoc = async (docid?: string, ownerid?: string) => {
  const doc = Doc.build(testValidDocObject(docid, ownerid));
  await doc.save();
  return doc;
};

export const testUploadFile = path.join(__dirname, 'test.pdf');

export const cleanDirectories = async () => {
  const theDir = path.join(__dirname, '../signings');
  fs.readdir(theDir, async (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlinkSync(path.join(theDir, file));
    }
  });
};

export const testValidDocObject = (
  docid?: string,
  ownerid?: string,
  signerid?: string,
  docstatus?: DocStatus
) => {
  const theSignerID = signerid || mongoose.Types.ObjectId().toHexString();
  return {
    docname: 'Test Doc',
    _id: docid || mongoose.Types.ObjectId().toHexString(),
    ownerid: ownerid || mongoose.Types.ObjectId().toHexString(),
    docstatus: docstatus || DocStatus.Signing,
    signers: [
      {
        email: 'test@test.com',
        signerid: theSignerID,
        tiergroup: 0,
      },
    ],
    sigboxes: [
      {
        x: randomFloat(5, 70),
        y: randomFloat(5, 70),
        width: randomFloat(5, 70),
        height: randomFloat(5, 70),
        page: 0,
        fontsize: 30,
        signerid: theSignerID,
        type: SigBoxType.Signature,
        value: '',
      },
      {
        x: randomFloat(5, 70),
        y: randomFloat(5, 70),
        width: randomFloat(5, 70),
        height: randomFloat(5, 70),
        page: 0,
        fontsize: 30,
        signerid: theSignerID,
        type: SigBoxType.Initials,
        value: '',
      },
    ],
  };
};

export const sigbox = (signerid?: string) => {
  return {
    x: randomFloat(5, 70),
    y: randomFloat(5, 70),
    width: randomFloat(5, 70),
    height: randomFloat(5, 70),
    clickedon: new Date(),
    page: 0,
    fontsize: 30,
    signerid: signerid || mongoose.Types.ObjectId().toHexString(),
    type: SigBoxType.Signature,
    value: '',
  };
};

export const testValidDoc2Object = (
  docid?: string,
  ownerid?: string,
  signerid?: string,
  docstatus?: DocStatus
) => {
  const theSignerID = signerid || mongoose.Types.ObjectId().toHexString();
  return {
    docname: 'Winter Doc',
    _id: docid || mongoose.Types.ObjectId().toHexString(),
    ownerid: ownerid || mongoose.Types.ObjectId().toHexString(),
    docstatus: docstatus || DocStatus.Signing,
    signers: [
      {
        email: 'test@test.com',
        signerid: theSignerID,
        tiergroup: 0,
      },
    ],
    sigboxes: [
      {
        x: 20.6605222734255,
        y: 86.60709341254059,
        width: 38.0184331797235,
        height: 2.3793157530917743,
        page: 0,
        fontsize: 30,
        signerid: theSignerID,
        type: SigBoxType.Signature,
        value: '',
      },
    ],
  };
};
