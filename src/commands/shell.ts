import Command from '../base'
import Const from './../const'

export default class Shell extends Command {
  static description = 'Run shell scripts'

  static strict = false

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: true,
      description: 'project name',
      hidden: false
    }
  ]

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const docker = await this.getDocker()

    const argv = process.argv.slice(4)
    await docker.webCmd(project, `${argv.join(' ')}`)
  }
}
