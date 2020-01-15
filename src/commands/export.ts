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
    const dockerSourceDir = await this.env.get(Env.DOCKER_SOURCE_DIR)
    const projectDir = await this.env.get(Env.PROJECT_DIR)

    cli.action.start('push docker images')
    await this.dockerSource.push(project)
    cli.action.stop()

    cli.action.start('copy files')
    if (fs.existsSync(join(dockerSourceDir, 'system'))) {
      await fs.removeSync(join(projectDir, 'system'))
      await fs.copy(join(dockerSourceDir, 'system'), join(projectDir, 'system'))
      await this.updateDockerComposeFile(join(projectDir, 'system', 'docker-compose.yml'))
    }

    if (fs.existsSync(join(dockerSourceDir, project))) {
      await fs.removeSync(join(projectDir, project))
      await fs.copy(join(dockerSourceDir, project), join(projectDir, project))
      await this.updateDockerComposeFile(join(projectDir, project, 'docker-compose.yml'))
    }

    cli.action.stop()

    cli.action.start('zip files')
    await zip(join(projectDir, 'system'), join(projectDir, `system.zip`))
    await zip(join(projectDir, project), join(projectDir, `${project}.zip`))
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
    const searchKeyword = 'build: ./';

    for (let index = 0; index < dataArray.length; index++) {
      if (dataArray[index].includes(searchKeyword)) {
        newDataArray.splice(index, 1);
      }
    }

    const updatedData = newDataArray.join('\n');
    fs.writeFileSync(file, updatedData)
  }
}
