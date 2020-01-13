import cli from 'cli-ux'
import * as fs from 'fs'
import {join} from 'path'
import Command from '../base'
import Const from './../const'
import DockerLib from './../libs/docker'
import {mkdirSync} from "fs";
import Env from "./../libs/env"
import ProjectConfig from "./../libs/projectConfig"

export default class Docker extends Command {
  static description = 'Manage docker env'

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
      description: 'docker commands',
      hidden: false,
      options: [
        'up',
        'down',
        'restart',
        'rebuild'
      ],
    }
  ]

  static flags = {
    ...Command.flags
  }

  private docker: DockerLib = new DockerLib()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    cli.action.start('download files')
    if (this.args.command == 'up') {
      cli.action.start('docker up')
      await this.docker.up(project)
      cli.action.stop()
    } else if (this.args.command == 'down') {
      cli.action.start('docker down')
      await this.docker.down(project)
      cli.action.stop()
    }


  }
}
