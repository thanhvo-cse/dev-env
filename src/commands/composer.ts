import cli from 'cli-ux'
import Command from '../base'
import Const from './../const'
import DockerLib from './../libs/docker'

export default class Composer extends Command {
  static description = 'Composer'

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
    await this.docker.webCmd(project, `composer ${argv.join(' ')}`)
  }
}
