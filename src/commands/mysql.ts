import Command from '../base'
import Const from './../const'
import * as fs from "fs-extra"
import {join} from "path"
import Env from "../libs/env"
import DockerUpstream from "../services/dockerUpstream"

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
    ...Command.flags
  }

  private docker: DockerUpstream = new DockerUpstream()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const sharedDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
    const sharedProjectDir = join(sharedDir, project)

    if (this.args.command == 'backup') {
      await this.docker.dbBackup(project)

      if (this.args.file != undefined) {
        await fs.copy(join(sharedProjectDir, Const.ARG_PROJECT, 'database.sql'), this.args.file)
      }
    } else if (this.args.command == 'restore') {
      if (this.args.file != undefined) {
        await fs.copy(this.args.file, join(sharedProjectDir, Const.ARG_PROJECT, 'database.sql'))
      }

      await this.docker.dbRestore(project)
    }
  }
}
