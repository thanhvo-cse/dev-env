import Env from './../libs/Env'
import DockerAbstract from './dockerAbstract'
import {join} from "path"
import Const from './../const'

export default class DockerSource extends DockerAbstract {
  async up(project: string) {
    await this.dockerCompose(project, 'up -d --build')
  }

  async restart(project: string) {
    await this.dockerCompose(project, 'restart -d -build')
  }

  async push(project: string) {
    await this.dockerCompose(project, 'push')
  }

  protected async getProjectCompose(project: string) {
    const projectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    return join(projectDir, project, 'docker-compose.yml')
  }

  protected async getSystemCompose() {
    const projectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    return join(projectDir, 'system', 'docker-compose.yml')
  }

  public async getDbBackupFile(project: string) {
    const dbBackupDir = await this.env.get(Env.DATA_UPSTREAM_DB_BACKUP_DIR)
    return join(dbBackupDir, project, Const.DB_FILE)
  }
}
