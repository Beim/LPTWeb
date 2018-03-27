// debug proxy-debug release
const env = 'release';

const debug_config = {
  host: 'localhost',
  port: '8080',
};

const release_config = {
  host: '10.100.70.56',
  port: '80',
};

let config = 0;
export default config  = env === 'release' ? {...release_config, env} : {...debug_config, env};

