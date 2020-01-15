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
* [`dev-env cleanup`](#dev-env-cleanup)
* [`dev-env configure [COMMAND] [VALUE]`](#dev-env-configure-command-value)
* [`dev-env docker PROJECT COMMAND`](#dev-env-docker-project-command)
* [`dev-env down PROJECT`](#dev-env-down-project)
* [`dev-env export PROJECT`](#dev-env-export-project)
* [`dev-env help [COMMAND]`](#dev-env-help-command)
* [`dev-env import PROJECT`](#dev-env-import-project)
* [`dev-env restart PROJECT`](#dev-env-restart-project)
* [`dev-env up PROJECT`](#dev-env-up-project)

## `dev-env cleanup`

Cleanup docker environment

```
USAGE
  $ dev-env cleanup

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/cleanup.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.0/src/commands/cleanup.ts)_

## `dev-env configure [COMMAND] [VALUE]`

Manage configurations

```
USAGE
  $ dev-env configure [COMMAND] [VALUE]

ARGUMENTS
  COMMAND  (workspace:set|workspace:show|network:set|network:show|gdrive_project:set|gdrive_project:show|docker_source_d
           ir:set|docker_source_dir:show) configure commands

  VALUE    configure values

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/configure.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.0/src/commands/configure.ts)_

## `dev-env docker PROJECT COMMAND`

Manage docker env

```
USAGE
  $ dev-env docker PROJECT COMMAND

ARGUMENTS
  PROJECT  project name
  COMMAND  (up|down|restart|rebuild) docker commands

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/docker.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.0/src/commands/docker.ts)_

## `dev-env down PROJECT`

Down a project

```
USAGE
  $ dev-env down PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/down.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.0/src/commands/down.ts)_

## `dev-env export PROJECT`

Export project

```
USAGE
  $ dev-env export PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/export.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.0/src/commands/export.ts)_

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

_See code: [src/commands/import.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.0/src/commands/import.ts)_

## `dev-env restart PROJECT`

Restart a project

```
USAGE
  $ dev-env restart PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/restart.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.0/src/commands/restart.ts)_

## `dev-env up PROJECT`

Up a project

```
USAGE
  $ dev-env up PROJECT

ARGUMENTS
  PROJECT  project name

OPTIONS
  -b, --build  build
  -h, --help   show CLI help
```

_See code: [src/commands/up.ts](https://github.com/thanhvo-cse/dev-env/blob/v0.0.0/src/commands/up.ts)_
<!-- commandsstop -->
