export default class Env {
  static readonly CONFIG_ROOT: string = 'CONFIG_ROOT'
  static readonly CONFIG_DATA_DIR: string = 'CONFIG_DATA_DIR'
  static readonly CONFIG_CONFIG_DIR: string = 'CONFIG_CONFIG_DIR'

  static readonly WORKSPACE_DIR: string = 'WORKSPACE_DIR'
  static readonly SOURCE_UPSTREAM_PROJECT_DIR: string = 'SOURCE_UPSTREAM_PROJECT_DIR'
  static readonly DATA_UPSTREAM_PROJECT_DIR: string = 'DATA_UPSTREAM_PROJECT_DIR'
  static readonly DATA_UPSTREAM_DB_DIR: string = 'DATA_UPSTREAM_DB_DIR'
  static readonly DATA_UPSTREAM_DB_BACKUP_DIR: string = 'DATA_UPSTREAM_DB_BACKUP_DIR'
  static readonly DATA_LOCAL_PROJECT_DIR: string = 'DATA_LOCAL_PROJECT_DIR'
  static readonly DATA_LOCAL_DB_DIR: string = 'DATA_LOCAL_DB_DIR'
  static readonly DATA_LOCAL_DB_BACKUP_DIR: string = 'DATA_LOCAL_DB_BACKUP_DIR'

  static readonly REMOTE_HOST: string = 'REMOTE_HOST'
  static readonly PROJECT_NAME: string = 'PROJECT_NAME'

  async set(key: string, value: string) {
    process.env[key] = value
  }

  async get(key: string) {
    return process.env[key] || ''
  }
}
