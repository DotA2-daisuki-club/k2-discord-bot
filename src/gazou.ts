import { Message, TextChannel } from 'discord.js'
import { GAZOU_CHANNEL_ID } from './const'

const responseGazou = async (
  message: Message,
  args?: string[]
): Promise<void> => {
  const client = message.channel.client

  const channelName = args
    ?.find(arg => arg.startsWith(`channel=`))
    ?.replace(`channel=`, ``)

  const gazouChannel = channelName
    ? client.channels.cache.find(
        channel =>
          channel.isText() &&
          channel instanceof TextChannel &&
          channel.name === channelName
      )
    : await client.channels.fetch(GAZOU_CHANNEL_ID)

  if (!gazouChannel) {
    message.channel.send(`そんな名前のチャンネルはないぞまぬけ`)
    return
  }

  if (gazouChannel.isText() && gazouChannel instanceof TextChannel) {
    const messages = await gazouChannel.messages.fetch()
    const images = messages
      .filter(message => Object.keys(message.attachments).length === 0)
      .map(message => message.attachments.map(image => image.attachment))
      .flat(1)

    const randomImage = images[Math.floor(Math.random() * images.length)]

    if (typeof randomImage === `string`) {
      message.channel.send(randomImage)
    }
  }
}

export default responseGazou
