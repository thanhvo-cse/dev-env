import Command from '../../base'
import CustomConfig from "../../libs/customConfig"

export default class Gdrive extends Command {
  static description = 'Set or show gdrive id key'

  static args = [
    {
      name: 'key',
      required: false,
      description: 'Set the Gdrive id key'
    }
  ]

  static flags = {
    ...Command.flags
  }

  async run() {
    if (this.args.command != undefined) {
      await this.customConfig.set(CustomConfig.GDRIVE_ID, this.args.value)
    } else {
      console.log(await this.customConfig.get(CustomConfig.GDRIVE_ID))
    }
  }
}