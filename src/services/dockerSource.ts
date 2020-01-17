import Env from './../libs/Env'
import DockerAbstract from './dockerAbstract'
import {join} from "path";

export default class DockerSource extends DockerAbstract {
  async up(project: string) {
    await this.runWithSystem(project, 'up -d --build')
  }

  async restart(project: string) {
    await this.run(project, 'restart -d -build')
  }

  async push(project: string) {
    await this.runWithSystem(project, 'push')
  }

  protected async getProjectCompose(project: string) {
    const projectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    return join(projectDir, project, 'docker-compose.yml')
  }

  protected async getSystemCompose() {
    const projectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    return join(projectDir, 'system', 'docker-compose.yml')
  }
}
