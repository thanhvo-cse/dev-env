import {flags} from '@oclif/command'
import Command from '../base'

export default class Sync extends Command {
  static description = 'Docker sync'

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
    const argv = process.argv.slice(3)
    let cmd = `docker-sync ${argv.join(' ')}`

    const projectDir = await this.getProjectDir()
    await this.shell.script(`cd ${projectDir} && ${cmd}`)
  }
}
