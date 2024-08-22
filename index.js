import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { startCommand } from './scenes/commands/start.js';
import { config } from './scenes/module/config.js';

// Замените на ваш токен
const bot = new Telegraf(process.env.BOT_TOKEN);

// Создаем объект для хранения сессий
const sessions = {};

bot.use((ctx, next) => {
	if (!sessions[ctx.from.id]) {
		sessions[ctx.from.id] = {};
	}
	ctx.session = sessions[ctx.from.id];
	return next();
});

// Обработчик команды /start
bot.start(startCommand);


// Модуль обработки кнопки
config(bot);

bot
	.launch({
		webhook: {
			domain: process.env.DOMAIN || '',
			port: parseInt(process.env.HOOKPORT || ''),
		},
	})
	.then(() =>
		console.log(
			'Webhook bot listening on port',
			parseInt(process.env.HOOKPORT || '')
		)
	);
