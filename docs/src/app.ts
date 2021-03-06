import express from 'express';
import fileUpload from 'express-fileupload';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@edoccoding/common';

//import routes here
import { newDocRouter } from './routes/new';
import { getDocData } from './routes/getdata';
import { getDoc } from './routes/getdoc';
import { updateDocRouter } from './routes/update';
import { getDocsToSign } from './routes/getdocstosign';
import { getSignerDocs } from './routes/getsignerdocs';
import { signRouter } from './routes/sign';
import { certificateRouter } from './routes/cert';
import { deleteDocRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(fileUpload());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(deleteDocRouter);
app.use(getDocData);
app.use(getDoc);
app.use(updateDocRouter);
app.use(getDocsToSign);
app.use(getSignerDocs);
app.use(signRouter);
app.use(certificateRouter);

//attach routes to app
app.use(newDocRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
