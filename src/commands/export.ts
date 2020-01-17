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

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const sourceUpstreamProjectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    const dataUpstreamProjectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)

    cli.action.start('push docker images')
    // await this.docker.push(project)
    cli.action.stop()

    cli.action.start('copy files')
    if (fs.existsSync(join(sourceUpstreamProjectDir, 'system'))) {
      await fs.removeSync(join(dataUpstreamProjectDir, 'system'))
      await fs.copy(join(sourceUpstreamProjectDir, 'system'), join(dataUpstreamProjectDir, 'system'))
      await this.updateDockerComposeFile(join(dataUpstreamProjectDir, 'system', 'docker-compose.yml'))
    }

    if (fs.existsSync(join(sourceUpstreamProjectDir, project))) {
      await fs.removeSync(join(dataUpstreamProjectDir, project))
      await fs.copy(join(sourceUpstreamProjectDir, project), join(dataUpstreamProjectDir, project))
      await this.updateDockerComposeFile(join(dataUpstreamProjectDir, project, 'docker-compose.yml'))
    }
    cli.action.stop()

    cli.action.start('upload project files')
    await this.fileProjects.upload('system')
    await this.fileProjects.upload(project)
    cli.action.stop()

    if (this.flags.database) {
      cli.action.start('upload db files')
      await this.docker.dbBackup(project)
      await this.fileDb.upload(project)
      cli.action.stop()
    }
  }

  private async updateDockerComposeFile(file: string) {
    const data = fs.readFileSync(file, 'utf-8')
    let dataArray = data.split('\n');
    let newDataArray = dataArray
    const searchKeyword = 'build:';

    for (let index = 0; index < dataArray.length; index++) {
      if (dataArray[index].includes(searchKeyword)) {
        newDataArray.splice(index, 1);
      }
    }

    const updatedData = newDataArray.join('\n');
    fs.writeFileSync(file, updatedData)
  }
}
