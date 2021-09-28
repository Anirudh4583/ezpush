import chalk from 'chalk';
import execa from 'execa';
import Listr from 'listr';

async function gitAdd() {
  const res = await execa('git', ['add', '.'], {
    cwd: process.cwd(),
  });

  if (res.failed) {
    return Promise.reject(new Error('failed to stag files'));
  }
  return;
}

async function gitCommit(options) {
  const res = await execa('git', ['commit', '-m', options.commitMsg], {
    cwd: process.cwd(),
  });

  if (res.failed) {
    return Promise.reject(new Error('failed to stag files'));
  }
  return;
}

async function gitPush(options) {
  const res = await execa('git', ['push', 'origin', options.branch], {
    cwd: process.cwd(),
  });

  if (res.failed) {
    return Promise.reject(new Error('failed to stag files'));
  }
  return;
}

export async function ezpush(options) {
  const tasks = new Listr([
    {
      title: 'staging all files',
      task: () => gitAdd(),
    },
    {
      title: 'commiting changes',
      task: () => gitCommit(options),
    },
    {
      title: 'pushing commit to origin',
      task: () => gitPush(options),
    },
  ]);

  await tasks.run();
  console.log(chalk.green.bold('DONE'));
}
