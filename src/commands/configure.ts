import Command from '../base'
import Configs from '../libs/configs'
import cli from 'cli-ux'

export default class Configure extends Command {
  private configs = new Configs()

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
      hidden: true
    }
  ]

  static flags = {
    ...Command.flags
  }

  async run() {
    const {args, flags} = this.parse(Configure)

    if (args.command != undefined) {
      if (args.command == 'workspace:set') {
        this.configs.set('workspace', args.value)
      } else if (args.command == 'workspace:show') {
        console.log(await this.configs.get('workspace'))
      } else if (args.command == 'network:set') {
        this.configs.set('network', args.value)
      } else if (args.command == 'network:show') {
        console.log(await this.configs.get('network'))
      }
    } else {
      const workspace = await cli.prompt('Workspace dir?')
      this.configs.set('workspace', workspace)
      const network = await cli.prompt('Network?')
      this.configs.set('network', network)
    }
  }
}
