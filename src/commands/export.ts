import Command from '../base'
import Const from './../const'
import Docker from './../libs/docker'
import {zip} from 'zip-a-folder'
import Env from "../libs/env";
import {join} from 'path'
import * as fs from 'fs-extra'
import cli from "cli-ux";
import DockerSource from "../libs/dockerSource";

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
    ...Command.flags
  }

  private docker: Docker = new Docker()
  private dockerSource: DockerSource = new DockerSource()

  async run() {
    const project = this.args[Const.ARG_PROJECT]
    const dockerSourceUpstreamDir = await this.env.get(Env.DOCKER_SOURCE_UPSTREAM_DIR)
    const dataUpstreamDir = await this.env.get(Env.DATA_UPSTREAM_DIR)

    cli.action.start('push docker images')
    await this.dockerSource.push(project)
    cli.action.stop()

    cli.action.start('copy files')
    if (fs.existsSync(join(dockerSourceUpstreamDir, 'system'))) {
      await fs.removeSync(join(dataUpstreamDir, 'system'))
      await fs.copy(join(dockerSourceUpstreamDir, 'system'), join(dataUpstreamDir, 'system'))
      await this.updateDockerComposeFile(join(dataUpstreamDir, 'system', 'docker-compose.yml'))
    }

    if (fs.existsSync(join(dockerSourceUpstreamDir, project))) {
      await fs.removeSync(join(dataUpstreamDir, project))
      await fs.copy(join(dockerSourceUpstreamDir, project), join(dataUpstreamDir, project))
      await this.updateDockerComposeFile(join(dataUpstreamDir, project, 'docker-compose.yml'))
    }

    cli.action.stop()

    cli.action.start('zip files')
    await zip(join(dataUpstreamDir, 'system'), join(dataUpstreamDir, `system.zip`))
    await zip(join(dataUpstreamDir, project), join(dataUpstreamDir, `${project}.zip`))
    cli.action.stop()

    cli.action.start('upload files')
    await this.files.upload('system')
    await this.files.upload(project)
    cli.action.stop()
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
