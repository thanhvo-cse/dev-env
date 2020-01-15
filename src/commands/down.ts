import cli from 'cli-ux'
import Command from '../base'
import Const from './../const'
import DockerLib from './../libs/docker'

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

  private docker: DockerLib = new DockerLib()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    cli.action.start('docker down')
    await this.docker.down(project)
    cli.action.stop()
  }
}
