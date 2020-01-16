import * as fs from 'fs'
import {join} from 'path'
import {GoogleDrive} from './files/googleDrive'
import Env from './env'
import CustomConfig from './customConfig'
import Shell from './shell'

export default class Files {
  private gdrive: GoogleDrive = new GoogleDrive()
  private env: Env = new Env()
  private customConfig: CustomConfig = new CustomConfig()
  private shell: Shell = new Shell()

  async download(project: string) {
    const source = `${project}.zip`
    const dest = join(await this.env.get(Env.PROJECT_DIR), project)
    fs.mkdirSync(dest, {recursive: true})

    await this.gdrive.download(await this.customConfig.get(CustomConfig.GDRIVE_PROJECT_ID), source, dest)

    // TODO: should unzip by npm packages
    const zipFile = join(await this.env.get(Env.PROJECT_DIR), source)
    await this.shell.sh(`unzip -qo ${zipFile} -d ${dest}`)
  }

  async upload(project: string) {
    const source = join(await this.env.get(Env.PROJECT_DIR), `${project}.zip`)
    await this.gdrive.upload(source, await this.customConfig.get(CustomConfig.GDRIVE_PROJECT_ID), `${project}.zip`)
  }
}
