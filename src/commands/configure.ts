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
    const {args, flags} = this.parse(Configure)

    if (args.command != undefined) {
      if (args.command == 'workspace:set') {
        this.customConfig.set(CustomConfig.WORKSPACE_DIR, args.value)
      } else if (args.command == 'workspace:show') {
        console.log(await this.customConfig.get(CustomConfig.WORKSPACE_DIR))
      } else if (args.command == 'network:set') {
        this.customConfig.set(CustomConfig.NETWORK, args.value)
      } else if (args.command == 'network:show') {
        console.log(await this.customConfig.get(CustomConfig.NETWORK))
      }
    } else {
      const workspace = await cli.prompt('Workspace dir?')
      this.customConfig.set(CustomConfig.WORKSPACE_DIR, workspace)
      const network = await cli.prompt('Network?')
      this.customConfig.set(CustomConfig.NETWORK, network)
    }
  }
}
