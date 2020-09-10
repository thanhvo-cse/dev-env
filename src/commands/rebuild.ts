import Command from '../base'
import Const from './../const'
import {flags} from "@oclif/command"

export default class Rebuild extends Command {
  static description = 'Rebuild a project'

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

    await docker.rebuild(this.project)
  }
}
