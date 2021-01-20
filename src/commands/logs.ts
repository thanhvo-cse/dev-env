import Command from '../base'
import Const from './../const'
import {flags} from "@oclif/command"

export default class Logs extends Command {
  static description = 'Logs'

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
    let cmd = `docker logs php_${this.project} ${argv.join(' ')}`

    await this.shell.script(cmd)
  }
}
