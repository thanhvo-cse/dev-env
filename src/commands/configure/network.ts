import Command from '../../base'
import CustomConfig from "../../libs/customConfig"

export default class Network extends Command {
  static description = 'Set or show network name'

  static args = [
    {
      name: 'network name',
      required: false,
      description: 'Set the network name'
    }
  ]

  static flags = {
    ...Command.flags
  }

  async run() {
    if (this.args.command != undefined) {
      await this.customConfig.set(CustomConfig.NETWORK, this.args.value)
    } else {
      console.log(await this.customConfig.get(CustomConfig.NETWORK))
    }
  }
}