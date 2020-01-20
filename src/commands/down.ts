import cli from 'cli-ux'
import Command from '../base'
import Const from './../const'
import {flags} from "@oclif/command"

export default class Down extends Command {
  static description = 'Down a project'

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
    })
  }

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const docker = await this.getDocker()

    cli.action.start('docker down')
    await docker.down(project)
    cli.action.stop()
  }
}
