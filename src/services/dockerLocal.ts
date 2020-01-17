import Env from './../libs/Env'
import DockerAbstract from './dockerAbstract'

export default class DockerLocal extends DockerAbstract {
  async up(project: string) {
    await this.runWithSystem(project, 'up -d --build')
  }

  async restart(project: string) {
    await this.run(project, 'restart -d -build')
  }

  protected async getDockerDir() {
    return await this.env.get(Env.DATA_LOCAL_PROJECT_DIR)
  }
}
