import axios from 'axios'

import Bot from '../models/Bot'

export const postAdded = async message => {
  console.log('The bot received a new message')
  let text = message.body.text
  if (!text) {
    return // not a text message
  }
  const botId = message.ownerId
  const userId = message.body.creatorId
  if (botId === userId) {
    return // bot should not talk to itself to avoid dead-loop conversation
  }
  const groupId = message.body.groupId
  const bot = await Bot.findByPk(botId)
  const group = await bot.getGroup(groupId)
  const isPrivateChat = group.members.length <= 2
  if (!isPrivateChat && (
    message.body.mentions === null ||
    !message.body.mentions.some(m => m.type === 'Person' && m.id === botId)
  )) {
    return
  }
  text = text.replace(/!\[:Person\]\(\d+\)/g, ' ').trim()
  if (text.startsWith('__rename__')) {
    await bot.rename(text.substring(10).trim())
    return
  }
  if (text === '__setAvatar__') {
    if ((message.body.attachments || []).length === 0) {
      return
    }
    const attachment = message.body.attachments[0]
    const r = await axios.get(attachment.contentUri, { responseType: 'arraybuffer' })
    await bot.setAvatar(r.data, attachment.name)
    return
  }
  return { text, group, bot, userId }
}

export const deleted = async message => {
  const botId = message.body.extensionId
  console.log(`Bot user ${botId} has been deleted`)
  const bot = await Bot.findByPk(botId)
  await bot.remove()
  return bot
}
