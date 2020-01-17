import cli from 'cli-ux'
import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'
import DockerUpstream from "../services/dockerUpstream"

export default class Up extends Command {
  static description = 'Up a project'

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: true,
      description: 'project name',
      hidden: false
    }
  ]

  static flags = {
    ...Command.flags,
    build: flags.boolean({
      char: 'b',
      description: 'build'
    })
  }

  private docker: DockerUpstream = new DockerUpstream()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    cli.action.start('docker up')

    if (this.flags.hasOwnProperty('build') && this.flags.build) {
      await this.docker.up(project)
    } else {
      await this.docker.up(project)
    }

    cli.action.stop()
  }
}
