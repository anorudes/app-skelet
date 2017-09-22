import { sequelize } from '../src/sequelize/connect';
import { findServerScripts, findServerScript } from '../src/sequelize/requests';
import { ServerScript } from '../src/sequelize/models';
import { getFilesFromFolder } from '../src/utils/file';
import runScript from '../src/utils/runScript';

async function dbSync() {
  await sequelize.sync({ force: false });
  console.log('ok! sync complete');
}

async function startSync() {
  await dbSync();

  console.log('Finished')
  process.exit(0);
}

startSync();

