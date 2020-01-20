import Shell from './../libs/shell'

export default class Hosts {
  private shell: Shell = new Shell()

  async addHost(project: string, quiteFlag: boolean = false) {
    let echo = ''
    if (!quiteFlag) {
      echo = `echo "Host name local-${project}.legato.co is added successfully"`
    }

    await this.shell.sh(`
      if ! grep -q local-${project}.legato.co "/etc/hosts"; then
          sudo -- sh -c -e "echo '127.0.0.1 local-${project}.legato.co' >> /etc/hosts"
          ${echo}
      fi
    `)
  }
}
