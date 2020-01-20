import Command from '../base'
import Const from './../const'
import * as fs from "fs-extra"
import {flags} from "@oclif/command"

export default class Mysql extends Command {
  static description = 'Mysql'

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: true,
      description: 'project name',
      hidden: false
    },
    {
      name: 'command',
      required: true,
      description: 'mysql commands',
      hidden: false,
      options: [
        'backup',
        'restore',
      ],
    },
    {
      name: 'file',
      required: false,
      description: 'file path',
      hidden: false
    }
  ]

  static flags = {
    ...Command.flags,
    source: flags.boolean({
      char: 's',
      description: 'with source'
    }),
    local: flags.boolean({
      char: 'l',
      description: 'locally'
    })
  }

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const docker = await this.getDocker()

    if (this.args.command == 'backup') {
      await docker.dbBackup(project)

      if (this.args.file != undefined) {
        await fs.copy(await docker.getDbBackupFile(project), this.args.file)
      }
    } else if (this.args.command == 'restore') {
      if (this.args.file != undefined) {
        await fs.copy(this.args.file, await docker.getDbBackupFile(project))
      }

      await docker.dbRestore(project)
    }
  }
}
