import { Client } from 'discord.js'
import responseGazou from './gazou'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const main = (): void => {
  const client = new Client()

  client.once(
    `ready`,
    async (): Promise<void> => {
      console.log(`準備完了`)
    }
  )

  client.on(`message`, message => {
    if (message.author.bot) {
      return
    }

    type Command = `/gazou`
    const [command, ...args] = message.content.split(` `) as [
      Command,
      ...(string | never)[]
    ]

    if (command === `/gazou`) {
      responseGazou(message, args)
    }
  })

  client.login(process.env.DISCORD_BOT_TOKEN)
}

main()
