import * as fs from 'fs'
import {join} from 'path'
import readline from 'readline-promise'
import {google} from 'googleapis'
import CustomConfig from "../customConfig";

export class GoogleDrive {
  // If modifying these scopes, delete token.json.
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/drive',
  ]

  private customConfig: CustomConfig = new CustomConfig()
  private oAuth2Client: any
  private drive: any

  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  private readonly TOKEN_PATH = 'token.json'

  constructor() {
    const content = fs.readFileSync('gdrive.json')
    const credentials = JSON.parse(content + '')
    const {client_secret, client_id, redirect_uris} = credentials.installed
    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
    this.drive = google.drive({version: 'v3', auth: this.oAuth2Client})
  }

  async upload(folder: string, fileName: string, source: string) {
    const root = await this.customConfig.get(CustomConfig.GDRIVE_ID)
    let dir = (await this.find(`parents in '${root}' and name='${folder}'`))[0]
    if (dir === undefined) {
      try {
        const res = await this.drive.files.create({
          resource: {
            'name': folder,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [root]
          },
          fields: 'id'
        })

        dir = res.data
        console.log(`Created folder: ${folder}`)
      } catch (e) {
        console.log('The API returned an error: ' + e.message)
      }
    }

    this.remove(dir.id, fileName)
    try {
      const res = await this.drive.files.create({
        resource: {
          'name': fileName,
          parents: [dir.id]
        },
        media: {
          mimeType: 'application/zip',
          body: fs.createReadStream(source)
        },
        fields: 'id'
      })

      console.log(`Upload completed: ${fileName}`)
    } catch (e) {
      console.log('The API returned an error: ' + e.message)
    }
  }

  async download(folder: string, fileName: string, dest: string) {
    const root = await this.customConfig.get(CustomConfig.GDRIVE_ID)
    const dir = (await this.find(`parents in '${root}' and name='${folder}'`))[0]
    if (dir !== undefined) {
      const file = await this.find(`parents in '${dir.id}' and name='${fileName}'`)

      if (file[0]) {
        const item = file[0]
        try {
          await this.drive.files.get(
            {
              fileId: item.id,
              alt: 'media'
            },
            {responseType: 'stream'}
          ).then(res => {
              return new Promise((resolve, reject) => {
                let progress = 0;
                let buf = new Array();
                res.data
                  .on('data', d => {
                    buf.push(d)
                    progress += d.length;
                    if (process.stdout.isTTY) {
                      console.log(`Downloaded ${progress} bytes`)
                    }
                  })
                  .on('end', () => {
                    const buffer = Buffer.concat(buf)
                    const filePath = join(dest, item.name)
                    fs.writeFileSync(filePath, buffer)
                    resolve()
                    console.log('Finish streaming')
                  })
                  .on('error', err => {
                    console.error('Error downloading file.');
                    reject(err);
                  })
              })
            }
          )

          console.log(`Download completed: ${item.name}`)
        } catch (e) {
          console.log('Error', e.message)
        }
      }
    }
  }

  private async remove(root: string, fileName: string) {
    try {
      await this.authorize()
      const file = await this.find(`parents in '${root}' and name='${fileName}'`)
      if (file[0]) {
        const files = await this.find(`parents in '${file[0].id}'`)
        const res = this.drive.files.delete({
          'fileId': file[0].id
        });
      }
    } catch (e) {
      console.log('The API returned an error: ' + e.message)
    }
  }

  private async find(cond: string) {
    try {
      await this.authorize()
      const res = await this.drive.files.list({
        q: 'trashed=false and ' + cond,
        fields: 'files(id, name)',
      })

      const files = res.data.files
      if (files && files.length) {
        return files
      }
    } catch (e) {
      console.log('The API returned an error: ' + e.message)
    }

    return []
  }

  private async authorize() {
    try {
      const token = fs.readFileSync(this.TOKEN_PATH)
      this.oAuth2Client.setCredentials(JSON.parse(token + ''))
    } catch (e) {
      await this.getAccessToken()
    }
  }

  private async getAccessToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    })

    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const code = await rl.questionAsync('Enter the code from that page here: ')
    try {
      const {tokens} = await this.oAuth2Client.getToken(code)
      this.oAuth2Client.setCredentials(tokens);

      fs.writeFileSync(this.TOKEN_PATH, JSON.stringify(tokens))
      console.log('Token stored')
    } catch (e) {
      console.error('Error retrieving access token', e.message)
    }
  }

}
