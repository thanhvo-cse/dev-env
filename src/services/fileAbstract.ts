import * as fs from 'fs'
import {join} from 'path'
import {GoogleDrive} from './../libs/files/googleDrive'
import Env from './../libs/env'
import CustomConfig from './../libs/customConfig'
import Shell from './../libs/shell'
import {zip} from "zip-a-folder";

export default abstract class FileAbstract {
  protected gdrive: GoogleDrive = new GoogleDrive()
  protected env: Env = new Env()
  protected customConfig: CustomConfig = new CustomConfig()
  protected shell: Shell = new Shell()

  protected sourceFolder: string = ''

  async download(project: string) {
    const sourcePath = await this.getSourcePath()
    await fs.mkdirSync(join(sourcePath, project), {recursive: true})
    await this.gdrive.download(this.sourceFolder, `${project}.zip`, sourcePath)

    // TODO: should unzip by npm packages
    const zipFile = join(sourcePath, `${project}.zip`)
    if (fs.existsSync(zipFile)) {
      const destDir = join(sourcePath, project)
      await this.shell.sh(`unzip -qo ${zipFile} -d ${destDir}`)
    }
  }

  async upload(project: string) {
    const sourcePath = await this.getSourcePath()
    await zip(join(sourcePath, project), join(sourcePath, `${project}.zip`))
    const source = join(sourcePath, `${project}.zip`)
    await this.gdrive.upload(this.sourceFolder, `${project}.zip`, source)
  }

  protected async abstract getSourcePath()
}
