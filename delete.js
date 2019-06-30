const _cliProgress = require('cli-progress');

// Config
const {
  authToken,
  guilds,
  userId,
  skippedChannels,
} = require('./config')

const {
  loadMessages,
  deleteMessage,
  getGuildInfo,
} = require('./functions')({ Authorization: authToken });

const baseApiUrl = 'https://discordapp.com/api/v6';

let progress = false;
let progressbar = new _cliProgress.Bar({
  format: '{guildName} | Deleting {messageId} from {channelId} | [{bar}] ({value}/{total}) {percentage}% | ETA: {eta}s',
}, _cliProgress.Presets.shades_classic);

const delay = (duration) => new Promise((resolve, reject) => setTimeout(resolve, duration))

async function deleteMsgs(guildId) {
  const { messages, total_results } = await loadMessages(guildId, userId);
  await delay(500);

  if (!progress) {
    const { name } = await getGuildInfo(guildId);
    await delay(500);
    progressbar.setTotal(total_results)
    progressbar.update(0, { guildName: name });
    progress = true;
  }


  for (const message of messages) {
    const msg = message.find(x => x.author.id === userId);

    if (msg === undefined || msg.author.id !== userId) continue;
    if (skippedChannels.includes(msg.channel_id)) continue;

    if (progressbar.value > progressbar.total) {
      progressbar.setTotal(total_results);
      progressbar.update(1);
    }

    await deleteMessage(msg.channel_id, msg.id);

    progressbar.increment(1, {
      messageId: msg.id,
      channelId: msg.channel_id,
    });


    // Rate limit shit
    await delay(501)
  }

  if (total_results > 25) await deleteMsgs(guildId);
}

async function main() {
  progressbar.start();
  for (const guild of guilds) {
    await deleteMsgs(guild);
    progress = false;
  }
  progressbar.stop();
}

try {
  main();
} catch (e) { console.error(e) }