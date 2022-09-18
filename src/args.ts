import yargs from 'yargs/yargs';

export interface Args {
  port: number;
}

export function getArgs(argv: string[] = process.argv): Args {
  return yargs(argv.slice(2))
    .option('port', {
      number: true,
      describe: 'Port to use.',
      default: 0,
    })
    .check((work) => Object.entries(work).find(([, v]) => Number.isNaN(v)) == null)
    .help()
    .strictOptions()
    .parseSync();
}
