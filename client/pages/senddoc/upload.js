import { useState } from 'react';
import Router from 'next/router';
import postFile from '../../hooks/post-file';
import { DocStatus } from '@edoccoding/common';
//http://djorg83.github.io/react-bootstrap-sweetalert/

const upload = ({ currentUser }) => {
  const [docname, setDocname] = useState('');
  const [image, setImage] = useState(null);

  const uploadToClient = (event) => {
    const img = event.target.files[0];
    setImage(img);
  };

  const { doRequest, errors } = postFile({
    url: '/api/docs',
    file: image,
    body: {
      docname,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      document.getElementById('fileIn').focus();
      return;
    }
    if (docname == '') {
      document.getElementById('docName').focus();
      return;
    }
    doRequest();
  };

  return (
    <div className="container">
      <h3>Choose a document to sign</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label for="fileIn">Upload a Document</label>
          <input
            type="file"
            className="form-control-file"
            onChange={uploadToClient}
            id="fileIn"
          />
        </div>
        <div class="form-group">
          <label for="docName">Document Name</label>
          <input
            type="text"
            id="docName"
            className="form-control"
            value={docname}
            onChange={(e) => setDocname(e.target.value)}
            placeholder="Document Name"
          />
        </div>
      </form>
      {errors}
    </div>
  );
};

export default upload;
