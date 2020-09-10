import Command from '../base'
import Const from './../const'
import {flags} from "@oclif/command"

export default class Restart extends Command {
  static description = 'Refresh a project'

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
    await docker.restart(this.project)
  }
}
