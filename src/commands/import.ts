import cli from 'cli-ux'
import Command from '../base'
import Const from './../const'
import Docker from './../libs/docker'

export default class Import extends Command {
  static description = 'Import project'

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: true,
      description: 'project name',
      hidden: false
    }
  ]

  static flags = {
    ...Command.flags
  }

  private docker: Docker = new Docker()

  async run() {
    // start the spinner
    cli.action.start('starting downloading')
    await this.files.download(this.args[Const.ARG_PROJECT])
    // stop the spinner
    cli.action.stop()

    // this.docker.up()
    // this.docker.dbRestore()
  }
}
