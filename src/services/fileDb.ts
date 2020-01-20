import Env from './../libs/env'
import FileAbstract from './fileAbstract'

export default class FileDb extends FileAbstract {
  protected sourceFolder: string = 'db'

  protected async getSourcePath() {
    return await this.env.get(Env.DATA_UPSTREAM_DB_BACKUP_DIR)
  }
}
