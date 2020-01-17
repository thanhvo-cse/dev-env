import cli from 'cli-ux'
import Command from '../base'
import Const from './../const'
import DockerUpstream from "../services/dockerUpstream";

export default class Down extends Command {
  static description = 'Down a project'

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

  private docker: DockerUpstream = new DockerUpstream()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    cli.action.start('docker down')
    await this.docker.down(project)
    cli.action.stop()
  }
}
