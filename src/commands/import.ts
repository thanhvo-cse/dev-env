import Command from '../base'
import cli from 'cli-ux'
import Env from './../libs/env'

export default class Import extends Command {
  static description = 'Import project'

  static args = [
    {
      name: 'project',
      required: true,
      description: 'project name',
      hidden: false
    }
  ]

  static flags = {
    ...Command.flags
  }

  async run() {
    const {args, flags} = this.parse(Import)
    this.env.set(Env.PROJECT_NAME, args.project)

    // start the spinner
    cli.action.start('starting downloading')
    this.files.download(args.project, function() {
      // stop the spinner
      cli.action.stop()
    })
  }
}
