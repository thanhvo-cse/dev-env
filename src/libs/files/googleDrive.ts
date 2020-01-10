import * as fs from 'fs'
import {join} from 'path'
import readline from 'readline-promise'
import {google} from 'googleapis'

export class GoogleDrive {
  // If modifying these scopes, delete token.json.
  private readonly SCOPES = [
      'https://www.googleapis.com/auth/drive',
  ]

  private oAuth2Client: any
  private drive: any

  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  private readonly TOKEN_PATH = 'token.json'

  constructor() {
    const content = fs.readFileSync(join(__dirname, './gdrive.json'))
    const credentials = JSON.parse(content + '')
    const {client_secret, client_id, redirect_uris} = credentials.installed
    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
    this.drive = google.drive({version: 'v3', auth: this.oAuth2Client})
  }

  async download(root: string, target: string, dest: string) {
    const folder = await this.find(`parents in '${root}' and name='${target}'`)
    if (folder[0]) {
      const files = await this.find(`parents in '${folder[0].id}'`)

      for (let i = 0; i < files.length; i++) {
        const item = files[i]
        var destFile = fs.createWriteStream(join(dest, item.name))
        try {
          const res = await this.drive.files.get(
              {
                fileId: item.id,
                alt: 'media'
              },
              {responseType: 'stream'}
          )

          res.data.pipe(destFile)
          console.log(`Download completed: ${item.name}`)
        } catch (e) {
          console.log('Error', e.message)
        }
      }
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
      } else {
        console.log('No files found.')
      }
    } catch (e) {
      console.log('The API returned an error: ' + e.message)
    }

    return []
  }

  private async authorize() {
    try {
      const token = fs.readFileSync(join(__dirname, this.TOKEN_PATH))
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

      fs.writeFileSync(join(__dirname, this.TOKEN_PATH), JSON.stringify(tokens))
      console.log('Token stored')
    } catch (e) {
      console.error('Error retrieving access token', e.message)
    }
  }

}
