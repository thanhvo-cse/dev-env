import Command from '../../base'
import cli from 'cli-ux'
import CustomConfig from "../../libs/customConfig"

export default class Workspace extends Command {
  static description = 'Set or show workspace path'

  static args = [
    {
      name: 'path',
      required: false,
      description: 'Set the workspace path'
    }
  ]

  static flags = {
    ...Command.flags
  }

  async run() {
    if (this.args.command != undefined) {
      await this.customConfig.set(CustomConfig.WORKSPACE_DIR, this.args.value)
    } else {
      console.log(await this.customConfig.get(CustomConfig.WORKSPACE_DIR))
    }
  }
}

