import request from './request';
import config from '../config';

const env = config.env;

const requestServer = (url, options) => {
  if (env === 'proxy-debug') {
    // url = `http://localhost:8080${url}`;
  }
  else {
    url = `http://${config.host}:${config.port}${url}`;
  }
  let newOptions = {
    ...options,
    credentials: 'omit',
  };
  return request(url, newOptions);
};

export default requestServer;