import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'

export default class Magento extends Command {
  static description = 'Magento'

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
    let cmd = `php bin/magento ${argv.join(' ')}`

    await docker.webCmd(this.project, cmd, this.flags.debug)
  }
}
