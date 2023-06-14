#! /usr/bin/env node

import { exec } from "shelljs";

// FIXME: This doesn"t work because the command
// `npm link` fails with the error:
// "Cannot destructure property 'name' of '.for' as it is undefined."
// There is an open bug on this at: https://github.com/npm/cli/issues/6006
exec("node main.js");