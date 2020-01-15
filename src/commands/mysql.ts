import cli from 'cli-ux'
import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'
import DockerLib from './../libs/docker'
import CustomConfig from "../libs/customConfig";
import * as fs from "fs-extra";
import {join} from "path";
import Env from "../libs/env";

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

  private docker: DockerLib = new DockerLib()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const sharedDir = await this.env.get(Env.SHARED_DIR)
    const sharedProjectDir = join(sharedDir, project)

    if (this.args.command == 'backup') {
      await this.docker.dbBackup(project)

      if (this.args.file != undefined) {
        await fs.copy(join(sharedProjectDir, Const.DB_BACKUP_DIR, 'database.sql'), this.args.file)
      }
    } else if (this.args.command == 'restore') {
      if (this.args.file != undefined) {
        await fs.copy(this.args.file, join(sharedProjectDir, Const.DB_BACKUP_DIR, 'database.sql'))
      }

      await this.docker.dbRestore(project)
    }
  }
}
