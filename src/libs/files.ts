import * as fs from 'fs'
import {join} from 'path'
import {GoogleDrive} from './files/googleDrive'
import Env from './env'
import CustomConfig from './customConfig'
import Const from './../const'

export default class Files {
  private gdrive: GoogleDrive = new GoogleDrive()
  private env: Env = new Env()
  private customConfig: CustomConfig = new CustomConfig()

  async download(project: string, callback?: any) {
    const dest = join(await this.env.get(Env.PROJECT_DIR), project)
    fs.mkdirSync(dest, { recursive: true })

    await this.gdrive.download(await this.customConfig.get(CustomConfig.GDRIVE_PROJECT_ID), project, dest)
  }

  async move(project: string, source: string, target: string) {
    const sourceFile = join(join(await this.env.get(Env.PROJECT_DIR), project), source)
    fs.createReadStream(sourceFile).pipe(fs.createWriteStream(target))
  }
}
