import Command from '../base'
import cli from 'cli-ux'
import CustomConfig from "../libs/customConfig";

export default class Configure extends Command {
  static description = 'Manage configurations'

  static args = [
    {
      name: 'command',
      required: false,
      description: 'configure commands',
      hidden: false,
      options: [
          'workspace:set',
          'workspace:show',
          'network:set',
          'network:show',
          'gdrive_project:set',
          'gdrive_project:show',
      ],
    },
    {
      name: 'value',
      required: false,
      description: 'configure values',
      hidden: false
    }
  ]

  static flags = {
    ...Command.flags
  }

  async run() {
    if (this.args.command != undefined) {
      if (this.args.command == 'workspace:set') {
        this.customConfig.set(CustomConfig.WORKSPACE_DIR, this.args.value)
      } else if (this.args.command == 'workspace:show') {
        console.log(await this.customConfig.get(CustomConfig.WORKSPACE_DIR))
      } else if (this.args.command == 'network:set') {
        this.customConfig.set(CustomConfig.NETWORK, this.args.value)
      } else if (this.args.command == 'network:show') {
        console.log(await this.customConfig.get(CustomConfig.NETWORK))
      } else if (this.args.command == 'gdrive_project:set') {
        this.customConfig.set(CustomConfig.GDRIVE_PROJECT_ID, this.args.value)
      } else if (this.args.command == 'gdrive_project:show') {
        console.log(await this.customConfig.get(CustomConfig.GDRIVE_PROJECT_ID))
      }
    } else {
      const workspace = await cli.prompt('Workspace dir?')
      this.customConfig.set(CustomConfig.WORKSPACE_DIR, workspace)
      const network = await cli.prompt('Network?')
      this.customConfig.set(CustomConfig.NETWORK, network)
      const gdriveProject = await cli.prompt('Google drive project id?')
      this.customConfig.set(CustomConfig.GDRIVE_PROJECT_ID, gdriveProject)
    }
  }
}