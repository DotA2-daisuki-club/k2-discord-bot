import { Message, TextChannel } from 'discord.js'
import { GAZOU_CHANNEL_ID } from './const'

const responceGazou = async (message:Message): Promise<void> => {
  const client = message.channel.client
  const gazouChannel = await client.channels.fetch(GAZOU_CHANNEL_ID)
  if (gazouChannel.isText() && gazouChannel instanceof TextChannel) {
    console.log(gazouChannel)
  }
}

export default responceGazou