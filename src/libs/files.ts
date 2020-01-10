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

  private projectDir: string = ''
  private sharedDir: string = ''

  async initialize() {
    const dataDir = await this.env.get(Env.CONFIG_DATA_DIR)
    this.projectDir = join(dataDir, Const.DATA_PROJECT_DIR)
    this.sharedDir = join(dataDir, Const.DATA_SHARED_DIR)
  }

  async download(target:string, callback?: any) {
    await this.initialize()

    const dest = join(await this.projectDir, target)
    // fs.mkdirSync(dest, { recursive: true })

    // await this.gdrive.download(await this.customConfig.get(CustomConfig.GDRIVE_PROJECT_ID), target, dest)

    console.log(join(dest, 'database.sql'))
    const source = join(dest, 'database.sql')
    const sharedDest = join(this.sharedDir, 'sql', 'database.sql')
    fs.createReadStream(source).pipe(fs.createWriteStream(sharedDest))
  }
}
