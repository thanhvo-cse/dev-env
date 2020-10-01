import Command from '../base'
import Const from './../const'
import {flags} from '@oclif/command'
import FileProjects from "../services/fileProjects"
import FileDb from "../services/fileDb"
import FileTransport from './../services/fileTransport'
import DockerSource from './../services/dockerSource'

export default class Export extends Command {
  static description = 'Export project'

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
    database: flags.boolean({
      char: 'd',
      description: 'database'
    })
  }

  private fileProjects: FileProjects = new FileProjects()
  private fileDb: FileDb = new FileDb()
  private fileTransport: FileTransport = new FileTransport()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const docker = new DockerSource()

    await this.fileTransport.initUpstreamDir(project)

    await docker.push(project)

    await this.fileTransport.copySourceToUpstream('system')
    await this.fileTransport.copySourceToUpstream(project)

    await this.fileProjects.upload('system')
    await this.fileProjects.upload(project)

    if (this.flags.database) {
      docker.up(project)

      await setTimeout(async () => {
        await docker.dbBackup(project)
        await this.fileDb.upload(project)
      }, 5000)
    }
  }
}
