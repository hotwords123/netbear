
'use strict';

const COLOR_ID = {
    fg: {
        black: 30,
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        purple: 35,
        cyan: 36,
        white: 37
    },
    bg: {
        black: 40,
        red: 41,
        green: 42,
        yellow: 43,
        blue: 44,
        purple: 45,
        cyan: 46,
        white: 47
    }
};

function printEx(str, { fg = "white", bg = "black", new_line = true }) {
    let prefix = '\x1b[' + COLOR_ID.fg[fg] + ';' + COLOR_ID.bg[bg] + 'm';
    let suffix = '\x1b[0m';
    if (new_line) suffix += '\n';
    process.stdout.write(prefix + str + suffix);
}

module.exports = { COLOR_ID, printEx };