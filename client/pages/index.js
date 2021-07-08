import bldClient from "../api/build-client";
import CreateSig from "../components/createsig";

//can derefernce values from getInitialProps
const landing = ({ currentUser }) => {
  return currentUser ? (
    ((currentUser.signatureset) ? <h1>You are signed in</h1> : <CreateSig currentUser={currentUser} />)
  ) : (
    <h1>You are not signed in</h1>
  );
};

//can preload data for pages here
landing.getInitialProps = async (context) => {
  //get data to show on landing page
  return {};
};

export default landing;
