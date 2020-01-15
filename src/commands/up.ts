import cli from 'cli-ux'
import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'
import Docker from './../libs/docker'
import DockerSource from './../libs/dockerSource'

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

  private docker: Docker = new Docker()
  private dockerSource: DockerSource = new DockerSource()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    cli.action.start('docker up')

    if (this.flags.hasOwnProperty('build') && this.flags.build) {
      await this.dockerSource.up(project)
    } else {
      await this.docker.up(project)
    }

    cli.action.stop()
  }
}
