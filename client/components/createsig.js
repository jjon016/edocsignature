import { useState } from 'react';
import useRequest from '../hooks/use-request';
import styles from '../css/fonts.module.css';
import { FontTypes } from '@edoccoding/common';

const CreateSig = ({ currentUser }) => {
  const [font, selFont] = useState('');
  
  const { doRequest, errors } = useRequest({
    url: '/api/docs/setsignature',
    method: 'post',
    body: {
      signaturetype:font,
      signature:currentUser.name,
      initialstype:font,
      initials:currentUser.initials,
    },
    onSuccess: () => {
      currentUser.signatureset=true;
      console.log(currentUser);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <form className="FontSelector" onSubmit={onSubmit}>
      <div>Select a Signature to Adopt</div>
      <div className="list-group">
          <div onClick={() => selFont(FontTypes.AlluraRegular)} className={styles.AlluraRegular}>{currentUser.name}</div>
          <div onClick={() => selFont(FontTypes.AnkeCallig)} className={styles.AnkeCallig}>{currentUser.name}</div>
          <div onClick={() => selFont(FontTypes.BlackJack)} className={styles.BlackJack}>{currentUser.name}</div>
          <div onClick={() => selFont(FontTypes.DancingScript)} className={styles.DancingScript}>{currentUser.name}</div>
          <div onClick={() => selFont(FontTypes.GradeCursive)} className={styles.GradeCursive}>{currentUser.name}</div>
      </div>
      <button className="btn btn-primary">Select</button>
      {errors}
    </form>
  )
}

export default CreateSig
