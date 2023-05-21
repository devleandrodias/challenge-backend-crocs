import colors from 'colors';

import { Logger } from '../shared/types/Logger';

export const loggerInfo = ({ type, log }: Logger) => {
	switch (type) {
		case 'success':
			console.info(colors.green(log));
			break;
		case 'error':
			console.info(colors.red(log));
			break;
		case 'warning':
			console.info(colors.yellow(log));
			break;
		case 'info':
			console.info(colors.cyan(log));
			break;
		default:
			console.info(colors.white(log));
			break;
	}
};
