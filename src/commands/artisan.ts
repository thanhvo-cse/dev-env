import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'

export default class Artisan extends Command {
  static description = 'Laravel Artisan'

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
    }),
    debug: flags.boolean({
      char: 'd',
      description: 'debug flag',
      required: false
    })
  }

  async run() {
    const docker = await this.getDocker()

    const argv = process.argv.slice(3).filter(e => e != '-d' && e != '--debug')
    let cmd = `php artisan ${argv.join(' ')}`

    await docker.webCmd(this.project, cmd, this.flags.debug)
  }
}
