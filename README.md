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
$ npm install -g @thanhvo-cse/dev-env
$ dev-env COMMAND
running command...
$ dev-env (-v|--version|version)
@thanhvo-cse/dev-env/0.0.2 darwin-x64 node-v12.14.1
$ dev-env --help [COMMAND]
USAGE
  $ dev-env COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dev-env artisan PROJECT`](#dev-env-artisan-project)
* [`dev-env cleanup`](#dev-env-cleanup)
* [`dev-env composer PROJECT`](#dev-env-composer-project)
* [`dev-env configure [COMMAND] [VALUE]`](#dev-env-configure-command-value)
* [`dev-env create PROJECT TEMPLATE`](#dev-env-create-project-template)
* [`dev-env down PROJECT`](#dev-env-down-project)
* [`dev-env export PROJECT`](#dev-env-export-project)
* [`dev-env grunt PROJECT`](#dev-env-grunt-project)
* [`dev-env help [COMMAND]`](#dev-env-help-command)
* [`dev-env import PROJECT`](#dev-env-import-project)
* [`dev-env ls`](#dev-env-ls)
* [`dev-env magento PROJECT`](#dev-env-magento-project)
* [`dev-env magerun PROJECT`](#dev-env-magerun-project)
* [`dev-env mysql PROJECT COMMAND [FILE]`](#dev-env-mysql-project-command-file)
* [`dev-env npm PROJECT`](#dev-env-npm-project)
* [`dev-env php PROJECT`](#dev-env-php-project)
* [`dev-env rebuild PROJECT`](#dev-env-rebuild-project)
* [`dev-env remove PROJECT`](#dev-env-remove-project)
* [`dev-env restart PROJECT`](#dev-env-restart-project)
* [`dev-env up PROJECT`](#dev-env-up-project)

## `dev-env artisan PROJECT`

Magerun

```
USAGE
  $ dev-env artisan PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -d, --debug   debug flag
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/artisan.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/artisan.ts)_

## `dev-env cleanup`

Cleanup docker environment

```
USAGE
  $ dev-env cleanup

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/cleanup.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/cleanup.ts)_

## `dev-env composer PROJECT`

Composer

```
USAGE
  $ dev-env composer PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/composer.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/composer.ts)_

## `dev-env configure [COMMAND] [VALUE]`

Manage configurations

```
USAGE
  $ dev-env configure [COMMAND] [VALUE]

ARGUMENTS
  COMMAND  (workspace:set|workspace:show|network:set|network:show|gdrive_project:set|gdrive_project:show|docker_source_d
           ir:set|docker_source_dir:show|xdebug_ide_key:set|xdebug_ide_key:show) configure commands

  VALUE    configure values

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/configure.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/configure.ts)_

## `dev-env create PROJECT TEMPLATE`

Create project

```
USAGE
  $ dev-env create PROJECT TEMPLATE

ARGUMENTS
  PROJECT   project name
  TEMPLATE  project template

OPTIONS
  -h, --help   show CLI help
  -l, --local  locally
```

_See code: [src/commands/create.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/create.ts)_

## `dev-env down PROJECT`

Down a project

```
USAGE
  $ dev-env down PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/down.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/down.ts)_

## `dev-env export PROJECT`

Export project

```
USAGE
  $ dev-env export PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -d, --database  database
  -h, --help      show CLI help
```

_See code: [src/commands/export.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/export.ts)_

## `dev-env grunt PROJECT`

Grunt

```
USAGE
  $ dev-env grunt PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/grunt.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/grunt.ts)_

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

## `dev-env import PROJECT`

Import project

```
USAGE
  $ dev-env import PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/import.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/import.ts)_

## `dev-env ls`

List imported projects

```
USAGE
  $ dev-env ls

OPTIONS
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/ls.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/ls.ts)_

## `dev-env magento PROJECT`

Magento

```
USAGE
  $ dev-env magento PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -d, --debug   debug flag
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/magento.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/magento.ts)_

## `dev-env magerun PROJECT`

Magerun

```
USAGE
  $ dev-env magerun PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -d, --debug   debug flag
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/magerun.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/magerun.ts)_

## `dev-env mysql PROJECT COMMAND [FILE]`

Mysql

```
USAGE
  $ dev-env mysql PROJECT COMMAND [FILE]

ARGUMENTS
  PROJECT  project name
  COMMAND  (backup|restore) mysql commands
  FILE     file path

OPTIONS
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/mysql.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/mysql.ts)_

## `dev-env npm PROJECT`

Npm

```
USAGE
  $ dev-env npm PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/npm.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/npm.ts)_

## `dev-env php PROJECT`

Php

```
USAGE
  $ dev-env php PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -d, --debug   debug flag
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/php.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/php.ts)_

## `dev-env rebuild PROJECT`

Rebuild a project

```
USAGE
  $ dev-env rebuild PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/rebuild.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/rebuild.ts)_

## `dev-env remove PROJECT`

Remove project

```
USAGE
  $ dev-env remove PROJECT

ARGUMENTS
  PROJECT  project name | all

OPTIONS
  -h, --help   show CLI help
  -l, --local  locally
```

_See code: [src/commands/remove.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/remove.ts)_

## `dev-env restart PROJECT`

Restart a project

```
USAGE
  $ dev-env restart PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/restart.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/restart.ts)_

## `dev-env up PROJECT`

Up a project

```
USAGE
  $ dev-env up PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help    show CLI help
  -l, --local   locally
  -s, --source  with source
```

_See code: [src/commands/up.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.2/src/commands/up.ts)_
<!-- commandsstop -->
