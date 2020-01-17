import Env from './../libs/Env'
import DockerAbstract from './dockerAbstract'

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

  protected async getDockerDir() {
    return await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
  }
}
