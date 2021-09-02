import { Message, TextChannel } from 'discord.js'
import { GAZOU_CHANNEL_ID } from './const'

const responseGazou = async (message: Message): Promise<void> => {
  const client = message.channel.client
  const gazouChannel = await client.channels.fetch(GAZOU_CHANNEL_ID)
  if (gazouChannel.isText() && gazouChannel instanceof TextChannel) {
    const messages = await gazouChannel.messages.fetch()
    const images = messages
      .filter(message => Object.keys(message.attachments).length === 0)
      .map(message => message.attachments.map(image => image.attachment))
      .flat(1)

    const randomImage = images[Math.floor(Math.random() * images.length)]

    if (typeof randomImage === `string`) {
      await message.channel.send(randomImage)
    }
  }
}

export default responseGazou
