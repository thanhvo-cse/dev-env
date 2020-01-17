import Command from '../base'
import Const from './../const'
import * as fs from "fs-extra"
import {join} from "path"
import Env from "../libs/env"
import DockerUpstream from "../services/dockerUpstream"
import {flags} from "@oclif/command";

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
    local: flags.boolean({
      char: 'l',
      description: 'locally'
    })
  }

  private docker: DockerUpstream = new DockerUpstream()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const upstreamDbBackupDir = await this.env.get(Env.DATA_UPSTREAM_DB_BACKUP_DIR)

    if (this.args.command == 'backup') {
      await this.docker.dbBackup(project)

      if (this.args.file != undefined) {
        await fs.copy(join(upstreamDbBackupDir, project, 'database.sql'), this.args.file)
      }
    } else if (this.args.command == 'restore') {
      if (this.args.file != undefined) {
        await fs.copy(this.args.file, join(upstreamDbBackupDir, project, 'database.sql'))
      }

      await this.docker.dbRestore(project)
    }
  }
}
