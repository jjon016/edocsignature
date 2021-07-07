import 'bootstrap/dist/css/bootstrap.css';

//thin wrapper around the component we are trying to show
//allows us to import bootstrap in all our pages
//see github.com/zeit/next.js/blob/master/errors/css-global.md

export default ({Component, pageProps}) => {
  return <Component {...pageProps} />
};