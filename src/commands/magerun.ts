import {flags} from '@oclif/command'
import Command from '../base'
import Const from './../const'
import DockerUpstream from "../services/dockerUpstream"

export default class Magerun extends Command {
  static description = 'Magerun'

  static strict = false

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
    debug: flags.boolean({
      char: 'd',
      description: 'debug flag',
      required: false
    })
  }

  private docker: DockerUpstream = new DockerUpstream()

  async run() {
    const project = this.args[Const.ARG_PROJECT]

    const argv = process.argv.slice(4).filter(e => e != '-d' && e != '--debug')
    let cmd = `magerun ${argv.join(' ')}`

    await this.docker.webCmd(project, cmd, this.flags.hasOwnProperty('debug'))
  }
}
