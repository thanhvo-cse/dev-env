import Env from './../libs/Env'
import DockerAbstract from './dockerAbstract'
import {join} from 'path'

export default class DockerUpstream extends DockerAbstract {
  protected async getProjectCompose(project: string) {
    const projectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
    return join(projectDir, project, 'docker-compose.yml')
  }

  protected async getSystemCompose() {
    const projectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)
    return join(projectDir, 'system', 'docker-compose.yml')
  }
}
