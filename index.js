const { TELEGRAM_BOT_TOKEN } = require('secret/secret');
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
// const bot = new Telegraf(process.env.BOT_TOKEN);
/*bot.start((context) => {
  console.log('Servizio avviato...')
  context.reply('Servizio ECHO avviato')
})
bot.on('text', context=>{
  text=context.update.message.text
  context.reply('Hai scritto: '+text)
})
bot.launch()*/

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('hipster', Telegraf.reply('λ'))
bot.command('info', ctx => {
  const [ commandName, matchId ] = ctx.update.message.text.split(' ');
  console.log('Request for match ' + matchId);
  // ctx.reply('Read info...');
  axios
      .post('https://dp-fit-prod-function.azurewebsites.net/api/v3/puc/competition/detail', {
        competitionid: matchId
      })
      .then(res => {
        if (res.statusCode === 500) {
          ctx.reply(`ERRORE: Torneo ${matchId} non trovato`);
          return;
        }
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res.data);
        ctx.reply(`ID Torneo: ${matchId}`);
        ctx.reply(`Descrizione: ${res.data.Description}`);
        ctx.reply(`Club: ${res.data.TennisClub} - ${res.data.Municipality} (${res.data.Province})`);
        ctx.reply(`Dal ${res.data.From} al ${res.data.To}`);
      })
      .catch(error => {
        console.error(error)
      })
});

bot.on('message', ctx => {
  ctx.reply('Received');
});

bot.on('text', (ctx) => {
  // Explicit usage
  ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`)

  // Using context shortcut
  ctx.reply(`Hello ${ctx.state.role}`)
})


bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


