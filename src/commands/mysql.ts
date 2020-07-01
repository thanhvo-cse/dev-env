import Command from '../base'
import Const from './../const'
import * as fs from "fs-extra"
import {flags} from "@oclif/command"
import {join} from "path"
import {normalize} from "path"

export default class Mysql extends Command {
  static description = 'Mysql'

  static args = [
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
    const project = this.project
    const docker = await this.getDocker()

    const dbBackupFile = await docker.getDbBackupFile(project)
    const dbBackupFileBk = normalize(dbBackupFile) + '.bk'

    if (this.args.file != undefined && fs.existsSync(dbBackupFile)) {
      await fs.moveSync(dbBackupFile, dbBackupFileBk, {overwrite: true})
    }

    if (this.args.command == 'backup') {
      await docker.dbBackup(project)

      if (this.args.file != undefined) {
        await fs.copySync(dbBackupFile, this.args.file, {overwrite: true})
      }
    } else if (this.args.command == 'restore') {
      if (this.args.file != undefined) {
        await fs.copySync(this.args.file, dbBackupFile, {overwrite: true})
      }

      await docker.dbRestore(project)
    }

    if (this.args.file != undefined && fs.existsSync(dbBackupFileBk)) {
      await fs.moveSync(dbBackupFileBk, dbBackupFile, {overwrite: true})
    }
  }
}
