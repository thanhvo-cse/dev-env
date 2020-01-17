import cli from 'cli-ux'
import Command from '../base'
import Const from './../const'
import Env from "./../libs/env"
import {flags} from "@oclif/command"
import ProjectTemplate from '../services/projectTemplate'
import FileTransport from '../services/fileTransport'

export default class Remove extends Command {
  static description = 'Remove project'

  static args = [
    {
      name: Const.ARG_PROJECT,
      required: true,
      description: 'project name',
      hidden: false
    }
  ]

  static flags = {
    ...Command.flags,
    local: flags.boolean({
      char: 'l',
      description: 'locally'
    })
  }

  private projectTemplate: ProjectTemplate = new ProjectTemplate()
  private fileTransport: FileTransport = new FileTransport()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    if (await cli.prompt(`Are you sure to remove project '${project}'? (y/n)`) == 'y') {
      cli.action.start('remove files')

      if (this.flags.local) {
        await this.projectTemplate.removeLocalProject(project)
        await this.fileTransport.removeLocalDir(project)
      } else {
        await this.projectTemplate.removeUpstreamProject(project)
        await this.fileTransport.removeUpstreamDir(project)
      }

      cli.action.stop()
    }
  }
}
