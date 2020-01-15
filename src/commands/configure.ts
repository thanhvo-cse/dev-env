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
        'docker_source_dir:set',
        'docker_source_dir:show',
        'xdebug_ide_key:set',
        'xdebug_ide_key:show',
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
        await this.customConfig.set(CustomConfig.WORKSPACE_DIR, this.args.value)
      } else if (this.args.command == 'workspace:show') {
        console.log(await this.customConfig.get(CustomConfig.WORKSPACE_DIR))
      } else if (this.args.command == 'network:set') {
        await this.customConfig.set(CustomConfig.NETWORK, this.args.value)
      } else if (this.args.command == 'network:show') {
        console.log(await this.customConfig.get(CustomConfig.NETWORK))
      } else if (this.args.command == 'gdrive_project:set') {
        await this.customConfig.set(CustomConfig.GDRIVE_PROJECT_ID, this.args.value)
      } else if (this.args.command == 'gdrive_project:show') {
        console.log(await this.customConfig.get(CustomConfig.GDRIVE_PROJECT_ID))
      } else if (this.args.command == 'docker_source_dir:set') {
        await this.customConfig.set(CustomConfig.DOCKER_SOURCE_DIR, this.args.value)
      } else if (this.args.command == 'docker_source_dir:show') {
        console.log(await this.customConfig.get(CustomConfig.DOCKER_SOURCE_DIR))
      } else if (this.args.command == 'xdebug_ide_key:set') {
        await this.customConfig.set(CustomConfig.XDEBUG_IDE_KEY, this.args.value)
      } else if (this.args.command == 'xdebug_ide_key:show') {
        console.log(await this.customConfig.get(CustomConfig.XDEBUG_IDE_KEY))
      }
    } else {
      const workspace = await cli.prompt('Workspace dir?')
      await this.customConfig.set(CustomConfig.WORKSPACE_DIR, workspace)
      const network = await cli.prompt('Network (en0)?')
      await this.customConfig.set(CustomConfig.NETWORK, network)
      const gdriveProject = await cli.prompt('Google drive project id?')
      await this.customConfig.set(CustomConfig.GDRIVE_PROJECT_ID, gdriveProject)
      const dockerSourceDir = await cli.prompt('Docker source dir?')
      await this.customConfig.set(CustomConfig.DOCKER_SOURCE_DIR, dockerSourceDir)
      const ideKey = await cli.prompt('Xdebug IDE key (PHPSTORM)?')
      await this.customConfig.set(CustomConfig.XDEBUG_IDE_KEY, ideKey)
    }
  }
}
