import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import type { ListDir, ListFile } from '@fastify/static';
import ejs from 'ejs';
import fastify from 'fastify';
import hljs from 'highlight.js';
import { marked } from 'marked';

import { getArgs } from './args';

import './index.css';

const args = getArgs();

export interface DirContext {
  dirs: ListDir[];
  files: ListFile[];
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __dirname = dirname(__filename);

const server = fastify({
  logger: true,
});

interface Params {
  file: string;
}

function markdown(filename: string) {
  const text = readFileSync(filename, 'utf-8');
  return marked(text, {
    gfm: true,
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      return hljs.highlightAuto(code, [lang]).value;
    },
  });
}

const root = process.cwd();
function getTitle(content: string) {
  const begin = content.indexOf('<h');
  if (begin < 0) {
    return null;
  }
  const zero = content.indexOf('>', begin + 2);
  if (zero < 0) {
    return null;
  }
  const end = content.indexOf('</', zero + 1);
  if (end < 0) {
    return null;
  }
  return content.substring(zero + 1, end);
}

server.get('/:file', async (req, reply) => {
  const { file } = req.params as Params;
  if (file === 'styles.css') {
    return reply.sendFile('styles.css', __dirname);
  }
  if (file.endsWith('.md')) {
    const content = markdown(`${root}/${file}`);
    const title = getTitle(content) || file;
    const html = `
    <!DOCTYPE html>
    <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" type="text/css" href="/styles.css">
      <title>${title}</title>
    </head>
    <body class="markdown-body"><div class="content">
      ${content}
    </div></body>
    </html>
    `;
    reply.type('text/html');
    return html;
  }
  return reply.sendFile(file);
});

const listEjs = ejs.compile(
  readFileSync(`${dirname(__dirname)}/list.ejs`, 'utf-8'),
);

server.register(fastifyStatic, {
  root,
  index: false,
  list: {
    format: 'html',
    // render: (dirs, files) => listHbs({ dirs, files }),
    render: (dirs, files) => listEjs({ dirs, files }),
  },
});

server.listen({ port: args.port }, (err, address) => {
  if (err) throw err;
  server.log.info(`server listening on ${address} .`);
});
