import Env from './Env'
import Docker from './docker'

export default class DockerSource extends Docker{
  async up(project: string) {
    await this.runWithSystem(project, 'up -d --build')
  }

  async restart(project: string) {
    await this.run(project, 'restart -d -build')
  }

  protected async getDockerDir() {
    return await this.env.get(Env.DOCKER_SOURCE_DIR)
  }
}
