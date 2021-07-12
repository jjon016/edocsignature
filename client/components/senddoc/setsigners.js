import React, { Component } from 'react';
import axios from 'axios';

class SetSigners extends Component {
  constructor(props) {
    super(props);

    console.log(this.props.docData);

    this.state = {
      signers: [{ name: 'Signer0', email: '' }],
      errors: null,
    };
  }
  setErrors = (errors) => {
    this.setState((state) => {
      return { signers: this.state.signers, errors: errors };
    });
  };
  AddSigner = () => {
    this.setState((state) => {
      let signerlist = state.signers;
      signerlist.push({
        name: 'Signer' + signerlist.length.toString(),
        email: '',
      });
      return {
        signerlist,
        errors: null,
      };
    });
  };
  setValue = (name, newval) => {
    this.setState((state) => {
      let signerlist = state.signers;
      var indexOfSigner = signerlist.findIndex((i) => i.name === name);
      signerlist[indexOfSigner].email = newval;
      return {
        signerlist,
        errors: null,
      };
    });
  };

  doRequest = async () => {
    try {
      this.setErrors(null);
      const response = await axios.post('/api/docs/update', {
        id: 123,
        signers: this.state.signers,
      });
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      this.setErrors(
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
  onSubmit = async (e) => {
    e.preventDefault();
    await this.doRequest();
  };
  render() {
    return (
      <div>
        {this.state.signers.map((signer) => (
          <div key={signer.name} className="row">
            <div className="form-group">
              <input
                key={signer.name}
                onChange={(e) => this.setValue(signer.name, e.target.value)}
                type="text"
                value={signer.email}
              />
            </div>
          </div>
        ))}
        <button className="btn btn-primary" onClick={this.AddSigner}>
          Add Signer
        </button>
        <button className="btn btn-success" onClick={this.onSubmit}>
          Continue
        </button>
        {this.state.errors}
      </div>
    );
  }
}

export default SetSigners;
