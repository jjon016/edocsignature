import axios from 'axios';

//creates instance of axios that is preconfigured to work on server or on client
const bldClient = ({ req }) => {
  //dereference off the request
  if (typeof window === 'undefined') {
    //on server
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    //on client
    return axios.create({
      baseURL: '/',
    });
  }
};

export default bldClient;
