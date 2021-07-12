import React from 'react';
import Upload from '../../components/senddoc/upload';
import SetSigners from '../../components/senddoc/setsigners';
import { useState } from 'react';

const senddoc = (props) => {
  const [theDoc, setCreatedDoc] = useState(null);

  return theDoc ? (
    <div>
      <Upload setCreatedDoc={setCreatedDoc} />
    </div>
  ) : (
    <div>
      <SetSigners docData={theDoc} setCreatedDoc={setCreatedDoc} />
    </div>
  );
};

export default senddoc;
