import yargs from 'yargs/yargs';

export interface Args {
  port: number;
  ejs: string | undefined;
  root: string | undefined;
}

export function getArgs(argv: string[] = process.argv): Args {
  return yargs(argv.slice(2))
    .option('port', {
      number: true,
      describe: 'Port to use.',
      default: 0,
    })
    .option('root', {
      string: true,
    })
    .option('ejs', {
      string: true,
      describe: 'EJS template to render dir-lists.',
    })
    .check((work) => Object.entries(work).find(([, v]) => Number.isNaN(v)) == null)
    .help()
    .strictOptions()
    .parseSync();
}
