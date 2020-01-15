import cli from 'cli-ux'
import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'
import DockerLib from './../libs/docker'
import CustomConfig from "../libs/customConfig";

export default class Grunt extends Command {
  static description = 'Grunt'

  static strict = false

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: true,
      description: 'project name',
      hidden: false
    }
  ]

  static flags = {
    ...Command.flags
  }

  private docker: DockerLib = new DockerLib()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    const argv = process.argv.slice(4)
    let cmd = `grunt ${argv.join(' ')}`

    await this.docker.webCmd(project, cmd)
  }
}
