import { useState } from 'react';
import useRequest from '../hooks/use-request';
import styles from '../css/fonts.module.css';
import { FontTypes } from '@edoccoding/common';
import classNames from 'classnames/bind';

let cx = classNames.bind(styles);

const CreateSig = ({ currentUser }) => {

  const [font, selFont] = useState(FontTypes.AlluraRegular);
  
  const fontClass = (aFont) =>{
    let selctd = (aFont==font)?'FontSelected':'FontNotSelected';
    return cx(selctd, aFont, 'Font');
  }

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
          <div onClick={() => selFont(FontTypes.AlluraRegular)} className={fontClass(FontTypes.AlluraRegular)}>{currentUser.name}</div>
          <div onClick={() => selFont(FontTypes.AnkeCallig)} className={fontClass(FontTypes.AnkeCallig)}>{currentUser.name}</div>
          <div onClick={() => selFont(FontTypes.BlackJack)} className={fontClass(FontTypes.BlackJack)}>{currentUser.name}</div>
          <div onClick={() => selFont(FontTypes.DancingScript)} className={fontClass(FontTypes.DancingScript)}>{currentUser.name}</div>
          <div onClick={() => selFont(FontTypes.GradeCursive)} className={fontClass(FontTypes.GradeCursive)}>{currentUser.name}</div>
      </div>
      <button className="btn btn-primary">Select</button>
      {errors}
    </form>
  )
}

export default CreateSig
