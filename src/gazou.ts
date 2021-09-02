import { Message, TextChannel, GUILD_PRIVATE_THREAD } from 'discord.js'
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

  if (!gazouChannel || gazouChannel.type === GUILD_PRIVATE_THREAD) {
    message.channel.send(`そんな名前のチャンネルはないぞまぬけ`)
    return
  }

  if (gazouChannel.isText() && gazouChannel instanceof TextChannel) {
    const messages = await gazouChannel.messages.fetch({ limit: 200 })
    const images = messages
      .filter(message => Object.keys(message.attachments).length === 0)
      .map(message =>
        message.attachments.map(image => ({
          url: image.attachment,
          author: message.author
        }))
      )
      .flat(1)

    const randomImage = images[Math.floor(Math.random() * images.length)]

    if (typeof randomImage.url === `string`) {
      message.channel.send(
        `${randomImage.url}\n by ${randomImage.author.username}`
      )
    }
  }
}

export default responseGazou
