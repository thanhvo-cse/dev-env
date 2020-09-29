import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'

export default class Up extends Command {
  static description = 'Up a project'

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
    source: flags.boolean({
      char: 's',
      description: 'with source'
    }),
    local: flags.boolean({
      char: 'l',
      description: 'locally'
    }),
    open: flags.boolean({
      char: 'o',
      description: 'Open project local domain on default local browser',
      default: false
    })
  }

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const docker = await this.getDocker()

    const projectDir = await this.getProjectDir(project)
    const projectDomain = `https://local-${project}.legato.co`
    //await this.shell.script(`cd ${projectDir} && docker-sync start`)

    await docker.up(project)
    console.log(`Project started on ${projectDomain}`)
    this.shell.script(`open ${projectDomain}`)
  }
}
