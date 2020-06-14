import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'
import path from "path";

export default class Up extends Command {
  static description = 'Up a project'

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: false,
      description: 'project name',
      hidden: false,
      default: path.basename(__dirname)
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
    })
  }

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const docker = await this.getDocker()

    await docker.up(project)
  }
}
