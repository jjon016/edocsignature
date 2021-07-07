import { useState } from 'react';
import axios from 'axios';

const signup = () => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    const res = await axios.post('/api/users/signup',{email,name,password});
    console.log(res.data);
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Signup</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
      </div>
      <div className="form-group">
        <label>Full Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" />
      </div>
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default signup
