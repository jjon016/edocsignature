import bldClient from "../api/build-client";
import Main from "../components/landingscreen/main";

//can derefernce values from getInitialProps
const landing = (props) => {
  const {currentUser} = props;
  return currentUser ? (
    <Main currentUser={currentUser} />
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
