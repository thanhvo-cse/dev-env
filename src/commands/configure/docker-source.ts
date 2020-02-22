import Command from '../../base'
import cli from 'cli-ux'
import CustomConfig from "../../libs/customConfig"

export default class Docker_Source extends Command
{
  static description = 'Set or show docker source directory'

  static args = [
    {
      name: 'key',
      required: false,
      description: 'Set the Docker source directory'
    }
  ]

  static flags = {
    ...Command.flags
  }
    
  async run() {
    if (this.args.command !== undefined) {
      await this.customConfig.set(CustomConfig.DOCKER_SOURCE_DIR, this.args.value)
    } else {
      console.log(await this.customConfig.get(CustomConfig.DOCKER_SOURCE_DIR))
    }
  }
}