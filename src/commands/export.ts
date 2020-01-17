import Command from '../base'
import Const from './../const'
import {flags} from '@oclif/command'
import Env from "../libs/env";
import {join} from 'path'
import * as fs from 'fs-extra'
import cli from "cli-ux";
import DockerSource from "../services/dockerSource"
import FileProjects from "../services/fileProjects"
import FileDb from "../services/fileDb"
import FileTransport from './../services/fileTransport'

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

  private docker: DockerSource = new DockerSource()
  private fileProjects: FileProjects = new FileProjects()
  private fileDb: FileDb = new FileDb()
  private fileTransport: FileTransport = new FileTransport()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const sourceUpstreamProjectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    const dataUpstreamProjectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)

    this.fileTransport.initUpstreamDir(project)

    cli.action.start('push docker images')
    // await this.docker.push(project)
    cli.action.stop()

    cli.action.start('copy files')
    await this.fileTransport.copySourceToUpstream('system')
    await this.fileTransport.copySourceToUpstream(project)
    cli.action.stop()

    cli.action.start('upload project files')
    await this.fileProjects.upload('system')
    await this.fileProjects.upload(project)
    cli.action.stop()

    if (this.flags.database) {
      cli.action.start('upload db files')
      await this.docker.up(project)

      await setTimeout(async () => {
        await this.docker.dbBackup(project)
        await this.fileDb.upload(project)
        cli.action.stop()
      }, 5000)
    }
  }
}
