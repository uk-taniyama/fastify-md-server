// copy from eslint/lib/cli-engine/formatters/visualstudio.js
/**
 * @fileoverview Visual Studio compatible formatter
 * @author Ronald Pijnacker
 */

const path = require('node:path');

const chalk = require('chalk');

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns the severity of warning or error
 * @param {Object} message message object to examine
 * @returns {string} severity level
 * @private
 */
function getMessageType(message) {
  if (message.fatal || message.severity === 2) {
    return chalk.red('error');
  }
  return chalk.yellow('warning');
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (results) => {
  let output = '';
  let total = 0;

  results.forEach((result) => {
    const { messages } = result;

    total += messages.length;

    messages.forEach((message) => {
      output += path.relative(process.cwd(), result.filePath);
      output += `(${message.line || 0}`;
      output += message.column ? `,${message.column}` : '';
      output += `): ${getMessageType(message)}`;
      output += message.ruleId ? ` ${message.ruleId}` : '';
      output += ` : ${message.message}`;
      output += '\n';
    });
  });

  if (total === 0) {
    output += 'no problems';
  } else {
    output += `\n${total} problem${total !== 1 ? 's' : ''}`;
  }

  return output;
};
