const path = require('path');
const fs = require('fs');

const DEPLOYMENGT_DIR = path.join(__dirname, '/deployment.json');

//读取
function readDeployment() {
  if (!fs.existsSync(DEPLOYMENGT_DIR)) return null;
  try {
    return JSON.parse(fs.readFileSync(DEPLOYMENGT_DIR, { encoding: 'utf-8' }));
  } catch {
    return null;
  }
}
//写入
function saveDeployment(payload) {
  let oldData = readDeployment();
  if (!oldData) oldData = {};
  fs.writeFileSync(
    DEPLOYMENGT_DIR,
    JSON.stringify({
      ...oldData,
      ...payload,
    }),
    { flag: 'w+' }
  );
  return true;
}

module.exports = {
  readDeployment,
  saveDeployment,
};