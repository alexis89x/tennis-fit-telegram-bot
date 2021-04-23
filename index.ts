import {Context} from "telegraf";
import {ICompetition} from "./models/ICompetition";

const { TELEGRAM_BOT_TOKEN } = require('./secret/secret');
const { getCompetitionInfo } = require('./utils/data.service');
const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx: Context) => {
  ctx.reply('Benvenuto nel BOT Tornei FIT (non ufficiale)');
})

bot.help((ctx) => ctx.reply('Send me a sticker'));

bot.command('info', ctx => {
  const [ commandName, matchId ] = ctx.update.message.text.split(' ');
  console.log('Request for match ' + matchId);
  // ctx.reply('Read info...');
  getCompetitionInfo(matchId)
      .then((competition: ICompetition) => {
        ctx.reply(`ID Torneo: ${competition.CompetitionId}`);
        ctx.reply(`Descrizione: ${competition.Description}`);
        ctx.reply(`Club: ${competition.TennisClub} - ${competition.Municipality} (${competition.Province})`);
        ctx.reply(`Dal ${competition.From} al ${competition.To}`);
      })
      .catch(err => {
        ctx.reply(`ERRORE: Torneo ${matchId} non trovato.`);
        console.error(err);
      });
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



