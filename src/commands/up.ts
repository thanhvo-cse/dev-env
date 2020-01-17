import cli from 'cli-ux'
import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'
import DockerUpstream from "../services/dockerUpstream"
import DockerSource from '../services/dockerSource'
import DockerLocal from '../services/dockerLocal'

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
    source: flags.boolean({
      char: 's',
      description: 'with source'
    }),
    local: flags.boolean({
      char: 'l',
      description: 'locally'
    })
  }

  private dockerUpstream: DockerUpstream = new DockerUpstream()
  private dockerSource: DockerSource = new DockerSource()
  private dockerLocal: DockerLocal = new DockerLocal()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    cli.action.start('docker up')

    if (this.flags.source) {
      await this.dockerSource.up(project)
    } else if (this.flags.local) {
      await this.dockerLocal.up(project)
    } else {
      await this.dockerUpstream.up(project)
    }

    cli.action.stop()
  }
}
