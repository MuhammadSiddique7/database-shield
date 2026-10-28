const crypto = require('crypto');

const generateApiKey = () => {
  return 'ds_live_' + crypto.randomBytes(32).toString('hex');
};

module.exports = generateApiKey;
