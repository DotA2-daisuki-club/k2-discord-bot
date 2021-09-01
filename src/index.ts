require('dotenv').config()

import { Client } from 'discord.js'
import responceGazou from './gazou'

const main = () => {
  const client = new Client()

  client.once(`ready`, async () => {
    console.log(`準備完了`)
  })
  
  client.on(`message`, async message => {
    if (message.content === `/gazou`) {
      responceGazou(message)
    }
  })
  
  client.login(process.env.DISCORD_BOT_TOKEN)
}

main()