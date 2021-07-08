import 'bootstrap/dist/css/bootstrap.css';
import bldClient from '../api/build-client';
import Header from '../components/header';

//Thin wrapper around the component we are trying to show
//-Allows us to import bootstrap in all our pages 
//-Sets up currentUser and header
//see github.com/zeit/next.js/blob/master/errors/css-global.md

const _app = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
}

_app.getInitialProps = async (appContext) => {
  const client = bldClient(appContext.ctx);
  const { data } = await client.get(
    '/api/users/currentuser'
  );
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }
  return { pageProps, ...data };
};

export default _app;
