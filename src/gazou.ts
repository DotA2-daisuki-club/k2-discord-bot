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
    const messages = await gazouChannel.messages.fetch({ limit: 100 })
    const images = messages
      .filter(message => Object.keys(message.attachments).length === 0)
      .map(message =>
        message.attachments.map(image => ({
          url: image.attachment,
          filename: image.name,
          author: message.author.username
        }))
      )
      .flat(1)

    // ファイル名と投稿者が被ってたら重複とみなし削除
    let imageCache: Omit<typeof images[number], 'url'>[] = []
    let imagesNotDuplicate: typeof images = []
    for (const image of images) {
      if (
        !imageCache.some(
          ({ filename, author }) =>
            filename === image.filename && author === image.author
        )
      ) {
        imageCache = [
          ...imageCache,
          { filename: image.filename, author: image.author }
        ]
        imagesNotDuplicate = [...imagesNotDuplicate, image]
      }
    }

    const randomImage =
      imagesNotDuplicate[Math.floor(Math.random() * imagesNotDuplicate.length)]

    if (typeof randomImage.url === `string`) {
      console.log(images.length)
      console.log(imagesNotDuplicate.length)
      message.channel.send(randomImage.url)
      message.channel.send(`by ${randomImage.author}`)
    }
  }
}

export default responseGazou
