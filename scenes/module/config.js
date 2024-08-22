
import fetch from 'node-fetch';
import fs from 'fs';
export function config(bot) {
	// Обработчик нажатия кнопки
	bot.hears('Сделать конфиг', async ctx => {
		// Устанавливаем состояние ожидания конфигурации
		ctx.session.waitingForConfig = true;
		let configId = '';
		if (ctx.session.waitingForConfig) {
			// Получаем введенную конфигурацию
			const config = ctx.from.username;

			// Отправляем запрос на ваш API
			try {
				const response = await fetch(
					'http://localhost:500/api/wireguard/clientCreateTg',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ name: config }),
					}
				);

				const data = await response.json();

				if (data.success) {
					ctx.reply('Конфиг добавлен. Высылаю конфиг...');
				} else {
					ctx.reply('Failed to add configuration.');
				}
			} catch (error) {
				ctx.reply('An error occurred while adding configuration.');
			}

			try {
				const response = await fetch(
					'http://localhost:500/api/wireguard/client',
					{
						method: 'GET',
					}
				);
				const data = await response.json();

				data.map(item => {
					if (item.name === config) {
						configId = item.id;
						return;
					}
				});
			} catch (error) {
				console.log(error);
			}

			bot.on(ctx => {
				ctx.reply('Thanks for your response.');
			});

			const getConfigById = async () => {
				try {
					const response = await fetch(
						`http://localhost:500/api/wireguard/client/${configId}/configuration`,
						{
							method: 'GET',
						}
					);
					return response.text();
				} catch (error) {
					console.log(error);
				}
			};
			const createFileForSend = async () => {
				const configData = await getConfigById();
				if (configData) {
					const filePath = './config.conf';

					// Создание файла с конфигурацией
					fs.writeFileSync(filePath, configData);

					// Отправка файла в Telegram
					await ctx.replyWithDocument({ source: filePath });

					// Удаление файла после отправки (необязательно)
					fs.unlinkSync(filePath);
				} else {
					ctx.reply('Failed to retrieve the configuration.');
				}
			};

			createFileForSend();

			ctx.session.waitingForConfig = false;
		}
	});
}