import { Client } from 'discord.js'
import responseGazou from './gazou'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const main = (): void => {
  const client = new Client()

  client.once(`ready`, async () => {
    console.log(`準備完了`)
  })

  client.on(`message`, async message => {
    if (message.content === `/gazou`) {
      await responseGazou(message)
    }
  })

  client.login(process.env.DISCORD_BOT_TOKEN)
}

main()
