import Link from 'next/link';

const Main = ({ currentUser }) => {
  return (
    <div className="container">
      <div className="row my-1">
        <Link href="/senddoc/upload">
          <button className="btn btn-outline-primary">
            Send Document for Signing
          </button>
        </Link>
      </div>
      <div className="row my-1">
        <button className="btn btn-outline-primary">Manage Documents</button>
      </div>
      <div className="row my-1">
        <button className="btn btn-outline-primary">Settings</button>
      </div>
    </div>
  );
};

export default Main;
