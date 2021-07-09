import axios from 'axios';
import { useState } from 'react';
import FormData from 'form-data';

const postFile = ({ url, file, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const formData = new FormData();
      formData.append('FILE', file);
      formData.append('JSON', JSON.stringify(body));
      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/formdata' },
      });
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops ....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default postFile;
