let path = require(`path`);

convict = require(`convict`);
config = convict({
  env: {
    doc: `The application environment.`,
    format: [`production`, `development`, `test`],
    default: `development`,
    env: `NODE_ENV`,
    arg: `env`
  },
  basePath: {
    doc: `The PrizmDoc log file path.`,
    format: `*`,
    default: path.join(`/`, `Prizm`, `logs`),
    env: `BASE_PATH`,
    arg: `basePath`
  },
  wumbo: {
    doc: `wumbo`,
    format: `Boolean`,
    default: true,
    env: `WUMBO`,
    arg: `wumbo`
  }
});

// Perform validation
config.validate({
  allowed: `strict`
});

module.exports = config;
