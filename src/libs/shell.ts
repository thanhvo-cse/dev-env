import { exec } from 'child_process'

export default class Shell {
  async sh(cmd: string): Promise<any> {
    return new Promise(function (resolve, reject) {
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          reject(err)
        } else {
          resolve({ stdout, stderr })
        }
      })
    })
  }

}
