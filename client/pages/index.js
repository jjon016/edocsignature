import bldClient from "../api/build-client";

//can derefernce values from getInitialProps
const landing = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>landing page</h1>;
};

//can preload data for pages here
landing.getInitialProps = async (context) => {
  const axiosClient = bldClient(context);
  const {data} = await axiosClient.get('/api/users/currentuser');
  return data; //currentUser
};

export default landing;
