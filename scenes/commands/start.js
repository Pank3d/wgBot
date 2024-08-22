import {Markup } from 'telegraf';

export async function startCommand(ctx) {
	ctx.reply(
		'Нажмите сделать конфиг',
		Markup.keyboard([['Сделать конфиг']])
			.oneTime()
			.resize()
	);
}
