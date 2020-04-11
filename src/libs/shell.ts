import {exec} from 'child_process'

export default class Shell {
  static readonly MAX_BUFFER = 1024 * 1024 //Default 200 * 1024 Byte

  async sh(cmd: string, quiteFlag: boolean = false): Promise<any> {
    return new Promise(function (resolve, reject) {
      const makeProcess = exec(cmd, { maxBuffer: Shell.MAX_BUFFER }, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          resolve({stdout, stderr})
        }
      })

      if (!quiteFlag) {
        makeProcess.stdout.on('data', function (data) {
          process.stdout.write(data)
        })
      }
    })
  }
}
