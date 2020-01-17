import * as fs from "fs-extra";
import {join} from "path";
import Env from "../libs/env";

export default class FileTransport {
  private env: Env = new Env()

  async createUpstream(project: string) {
    const sourceUpstreamProjectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)

    let destProject = join(sourceUpstreamProjectDir, project)
    let destNginx = join(sourceUpstreamProjectDir, 'system', 'nginx', 'conf.d', 'upstream')
    let ipGroup = 10
  }

  async copySourceToUpstream(project: string) {
    const sourceUpstreamProjectDir = await this.env.get(Env.SOURCE_UPSTREAM_PROJECT_DIR)
    const dataUpstreamProjectDir = await this.env.get(Env.DATA_UPSTREAM_PROJECT_DIR)

    if (fs.existsSync(join(sourceUpstreamProjectDir, project))) {
      await fs.removeSync(join(dataUpstreamProjectDir, project))
      await fs.copy(join(sourceUpstreamProjectDir, project), join(dataUpstreamProjectDir, project))
      await this.updateDockerComposeFile(join(dataUpstreamProjectDir, project, 'docker-compose.yml'))
    }
  }

  async initUpstreamDir(project: string) {
    await this.initDir(await this.env.get(Env.DATA_UPSTREAM_DB_DIR), project)
    await this.initDir(await this.env.get(Env.DATA_UPSTREAM_DB_BACKUP_DIR), project)
  }

  async initLocalDir(project: string) {
    await this.initDir(await this.env.get(Env.DATA_LOCAL_DB_DIR), project)
    await this.initDir(await this.env.get(Env.DATA_LOCAL_DB_BACKUP_DIR), project)
  }

  async removeUpstreamDir(project: string) {
    await this.removeDir(await this.env.get(Env.DATA_UPSTREAM_DB_DIR), project)
    await this.removeDir(await this.env.get(Env.DATA_UPSTREAM_DB_BACKUP_DIR), project)
  }

  async removeLocalDir(project: string) {
    await this.removeDir(await this.env.get(Env.DATA_LOCAL_DB_DIR), project)
    await this.removeDir(await this.env.get(Env.DATA_LOCAL_DB_BACKUP_DIR), project)
  }

  private async initDir(dir: string, project: string) {
    if (!fs.existsSync(join(dir, project))) {
      await fs.mkdirSync(join(dir, project), {recursive: true})
    }
  }

  private async removeDir(dir: string, project: string) {
    if (fs.existsSync(join(dir, project))) {
      await fs.removeSync(join(dir, project))
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
    await fs.writeFileSync(file, updatedData)
  }
}
