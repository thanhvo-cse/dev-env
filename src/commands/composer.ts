import Command from '../base'
import Const from './../const'
import {flags} from "@oclif/command";

export default class Composer extends Command {
  static description = 'Composer'

  static strict = false

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

  async run() {
    const docker = await this.getDocker()

    const argv = process.argv.slice(4)
    await docker.webCmd(this.project, `composer ${argv.join(' ')}`)
  }
}
