import * as fs from 'fs'
import {join} from 'path'
import * as readline from 'readline'
import {google} from 'googleapis'

export class GoogleDrive {
  // If modifying these scopes, delete token.json.
  private readonly SCOPES = [
      'https://www.googleapis.com/auth/drive',
  ]

  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  private readonly TOKEN_PATH = 'token.json'

  async traversal(folder: string, name: string, callback: any) {
    this.find(folder, name,function(auth: any, folderItem: any) {
      const drive = google.drive({version: 'v3', auth})
      drive.files.list({
        q: `parents in '${folderItem.id}'`,
        fields: 'files(id, name)'
      }, (err, res: any) => {
        if (err) return console.log('The API returned an error: ' + err)
        const files = res.data.files
        if (files.length) {
          console.log('Files:')
          files.map((file: any) => {
            console.log(`${file.name} (${file.id})`)
            callback(auth, file)
          })
        } else {
          console.log('No files found.')
        }
      })
    })
  }

  async find(folder: string, name: string, callback: any) {
    this.execute(function (auth: any) {
      const drive = google.drive({version: 'v3', auth})
      drive.files.list({
        q: `parents in '${folder}' and name='${name}'`,
        fields: 'files(id, name)',
      }, (err, res: any) => {
        if (err) return console.log('The API returned an error: ' + err)
        const files = res.data.files
        if (files.length) {
          console.log(`${files[0].name} (${files[0].id})`)
          callback(auth, files[0])
        } else {
          console.log('No files found.')
        }
      })
    })
  }

  async download(folder: string, target: string, dest: string, callback: any) {
    this.traversal(folder, target,function(auth: any, item: any) {
      var destFile = fs.createWriteStream(join(dest, item.name))
      const drive = google.drive({version: 'v3', auth})
      drive.files.get({
        fileId: item.id,
        alt: 'media'
      },
          {responseType: 'stream'},
          function(err, res: any){
            res.data
                .on('end', () => {
                    console.log(`Download completed: ${target}`)
                    callback()
                  })
                .on('error', (err: any) => {
                    console.log('Error', err)
                  })
                // .pipe(destFile)
          }
      )
    })
  }

  private async execute(callback: any) {
    // Load client secrets from a local file.
    fs.readFile(join(__dirname, './gdrive.json'), (err, content) => {
      if (err) return console.log('Error loading client secret file:', err)
      // Authorize a client with credentials, then call the Google Drive API.
      this.authorize(JSON.parse(content + ''), callback)
    })

  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  private async authorize(credentials: any, callback: any) {
    const {client_secret, client_id, redirect_uris} = credentials.installed
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0])

    // Check if we have previously stored a token.
    fs.readFile(join(__dirname, this.TOKEN_PATH), (err, token) => {
      if (err) return this.getAccessToken(oAuth2Client, callback)
      oAuth2Client.setCredentials(JSON.parse(token + ''))
      callback(oAuth2Client)
    })
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  private async getAccessToken(oAuth2Client: any, callback: any) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    })
    console.log('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close()
      oAuth2Client.getToken(code, (err: any, token: string) => {
        if (err) return console.error('Error retrieving access token', err)
        oAuth2Client.setCredentials(token)
        // Store the token to disk for later program executions
        fs.writeFile(join(__dirname, this.TOKEN_PATH), JSON.stringify(token), (err) => {
          if (err) return console.error(err)
          console.log('Token stored')
        })
        callback(oAuth2Client)
      })
    })
  }

}
