dev-env
=======

dev-env tool

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dev-env.svg)](https://npmjs.org/package/dev-env)
[![Downloads/week](https://img.shields.io/npm/dw/dev-env.svg)](https://npmjs.org/package/dev-env)
[![License](https://img.shields.io/npm/l/dev-env.svg)](https://github.com/thanhvo-cse/dev-env/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g dev-env
$ dev-env COMMAND
running command...
$ dev-env (-v|--version|version)
dev-env/0.0.0 darwin-x64 node-v12.14.0
$ dev-env --help [COMMAND]
USAGE
  $ dev-env COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dev-env configure [COMMAND]`](#dev-env-configure-command)
* [`dev-env help [COMMAND]`](#dev-env-help-command)

## `dev-env configure [COMMAND]`

Manage configurations

```
USAGE
  $ dev-env configure [COMMAND]

ARGUMENTS
  COMMAND  (workspace:set|workspace:show|network:set|network:show) configure commands

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/configure.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.0/src/commands/configure.ts)_

## `dev-env help [COMMAND]`

display help for dev-env

```
USAGE
  $ dev-env help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
