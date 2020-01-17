import Command from '../base'
import Const from './../const'
import DockerUpstream from "../services/dockerUpstream"

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

  private docker: DockerUpstream = new DockerUpstream()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    const argv = process.argv.slice(4)
    let cmd = `grunt ${argv.join(' ')}`

    await this.docker.webCmd(project, cmd)
  }
}
