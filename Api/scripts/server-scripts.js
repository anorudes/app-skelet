import { sequelize } from '../src/sequelize/connect';
import { findServerScripts, findServerScript } from '../src/sequelize/requests';
import { ServerScript } from '../src/sequelize/models';
import { getFilesFromFolder } from '../src/utils/file';
import runScript from '../src/utils/runScript';

async function dbSync() {
  await sequelize.sync({ force: false });
  console.log('ok! sync complete');
}

async function executeServerScripts() {
  // Get all scripts from folder
  const serverScripts = await getFilesFromFolder(`${__dirname}/../scripts/migrations`);
  
  // Get all runned scripts from table
  const runnedScripts = await findServerScripts(['migrate']);

  // Merge result (add done)
  const notYeadRunnedScripts = serverScripts.filter(fileName => {
    return !runnedScripts.filter(script => script.fileName === fileName).length > 0;
  });

  if (!notYeadRunnedScripts || !notYeadRunnedScripts.length) {
    console.log('There are no new scripts to run');
    return true;
  }
  console.log("Scripts to execute: ", notYeadRunnedScripts.toString());

  for (let i=0; i < notYeadRunnedScripts.length; i++) {
    let fileName = notYeadRunnedScripts[i];
    try {
      console.log(`${__dirname}/migrations/${fileName}`);
      await runScript(`${__dirname}/migrations/${fileName}`);
      console.log('Script executed:', fileName);

      // Save in table
      await ServerScript.create({
        fileName,
        type: 'migrate',
      });

    } catch (err) {
      console.log(`Can't execute script `, fileName);
      // Send error
    }    
  }
}

async function startSync() {
  await dbSync();
  await executeServerScripts();

  console.log('Finished')
  process.exit(0);
}

startSync();

