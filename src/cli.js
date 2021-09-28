const arg = require('arg');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const { ezpush } = require('./main');

function parseArgsToOpt(rawArgs) {
  const args = arg(
    {
      '--branch': String,
      '--skip': Boolean,
      '-b': '--branch',
      '-s': '--skip',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    branch: args['--branch'] || 'master',
    skip: args['--skip'] || false,
    commitMsg: args._[0],
  };
}

async function missingOpt(options) {
  const defaultComitMsg = 'commit using ezpush';
  if (options.skip || options.commitMsg) {
    return {
      ...options,
      commitMsg: options.commitMsg || defaultComitMsg,
    };
  }

  const ans = await inquirer.prompt([
    {
      type: 'input',
      name: 'commitMsg',
      message: 'enter the commit message',
      default: 'commit using ezpush',
    },
  ]);

  return {
    ...options,
    commitMsg: options.commitMsg || ans.commitMsg,
  };
}

export async function cli(args) {
  let options = parseArgsToOpt(args);
  options = await missingOpt(options);
  // console.log(options);
  await ezpush(options);
}
