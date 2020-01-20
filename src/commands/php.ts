import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'

export default class Php extends Command {
  static description = 'Php'

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
    ...Command.flags,
    source: flags.boolean({
      char: 's',
      description: 'with source'
    }),
    local: flags.boolean({
      char: 'l',
      description: 'locally'
    }),
    debug: flags.boolean({
      char: 'd',
      description: 'debug flag',
      required: false
    })
  }

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const docker = await this.getDocker()

    const argv = process.argv.slice(4).filter(e => e != '-d' && e != '--debug')
    let cmd = `php ${argv.join(' ')}`

    await docker.webCmd(project, cmd, this.flags.debug)
  }
}
