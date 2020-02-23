import Command from '../../base'
import CustomConfig from "../../libs/customConfig"

export default class XdebugIdeKey extends Command
{
  static description = 'Set and show Xdebug IDE Key'

  static args = [
    {
      name: 'key',
      required: false,
      description: 'Set the Xdebug IDE Key'
    }
  ]

  static flags = {
    ...Command.flags
  }

  async run() {
    if (this.args.command !== undefined) {
      await this.customConfig.set(CustomConfig.XDEBUG_IDE_KEY, this.args.value)
    } else {
      console.log(await this.customConfig.get(CustomConfig.XDEBUG_IDE_KEY))
    }
  }
}