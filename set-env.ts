// filepath: /c:/Users/Datum-Redsoft/Desktop/PLANTILLA_ORIGINAL_ADUANA/packages/main_mod/set-env.ts
const { writeFile } = require('fs');
const { argv } = require('yargs');
require('dotenv').config();

const environment = argv.environment;
const isProduction = environment === 'prod';

const targetPath = isProduction
  ? './src/environments/environment.prod.ts'
  : './src/environments/environment.ts';

const envConfigFile = `export const environment = {
  production: ${isProduction},
  apiUrl: '${process.env.API_BASE_URL}'
};
`;

writeFile(targetPath, envConfigFile, (err: any) => {
  if (err) {
    console.log(err);
  }
  console.log(`Output generated at ${targetPath}`);
});