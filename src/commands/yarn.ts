import Command from '../base'
import Const from './../const'
import {flags} from "@oclif/command"

export default class Yarn extends Command {
  static description = 'Yarn'

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

    const argv = process.argv.slice(3)
    let cmd = `yarn ${argv.join(' ')}`

    await docker.webCmd(this.project, cmd)
  }
}
