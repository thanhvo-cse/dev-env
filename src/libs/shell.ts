import {exec} from 'child_process'

export default class Shell {
  async sh(cmd: string, quiteFlag: boolean = false): Promise<any> {
    return new Promise(function (resolve, reject) {
      const makeProcess = exec(cmd, (err, stdout, stderr) => {
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
