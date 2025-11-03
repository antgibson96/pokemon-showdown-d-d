/**
 * Dice Roll Command
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Allows users to roll dice of any type (d4, d6, d8, d10, d12, d20, d100, etc.)
 *
 * @license MIT
 */

export const commands: Chat.ChatCommands = {
	roll(target, room, user) {
		if (!target) {
			return this.parse('/help roll');
		}

		// Parse the dice notation (e.g., "2d6", "d20", "3d10+5")
		const diceRegex = /^(\d*)d(\d+)([+-]\d+)?$/i;
		const match = target.trim().match(diceRegex);

		if (!match) {
			return this.errorReply(
				"Invalid dice notation. Use format like: /roll d6, /roll 2d20, /roll 3d10+5"
			);
		}

		const numDice = parseInt(match[1]) || 1;
		const numSides = parseInt(match[2]);
		const modifier = match[3] ? parseInt(match[3]) : 0;

		// Validate inputs
		if (numDice < 1 || numDice > 100) {
			return this.errorReply("Number of dice must be between 1 and 100.");
		}
		if (numSides < 2 || numSides > 10000) {
			return this.errorReply("Number of sides must be between 2 and 10000.");
		}
		if (Math.abs(modifier) > 10000) {
			return this.errorReply("Modifier must be between -10000 and 10000.");
		}

		// Roll the dice
		const rolls: number[] = [];
		let total = 0;
		for (let i = 0; i < numDice; i++) {
			const roll = Math.floor(Math.random() * numSides) + 1;
			rolls.push(roll);
			total += roll;
		}

		// Add modifier to total
		const finalTotal = total + modifier;

		// Format the output
		let message = `${user.name} rolled ${numDice}d${numSides}`;
		if (modifier !== 0) {
			message += `${modifier >= 0 ? '+' : ''}${modifier}`;
		}
		message += `: `;

		if (numDice === 1) {
			message += `<strong>${rolls[0]}</strong>`;
			if (modifier !== 0) {
				message += ` ${modifier >= 0 ? '+' : ''}${modifier} = <strong>${finalTotal}</strong>`;
			}
		} else {
			message += `[${rolls.join(', ')}]`;
			if (modifier !== 0) {
				message += ` = ${total} ${modifier >= 0 ? '+' : ''}${modifier} = <strong>${finalTotal}</strong>`;
			} else {
				message += ` = <strong>${total}</strong>`;
			}
		}

		// Broadcast the roll
		this.add(`|html|${message}`);
		this.room?.update();
	},

	rollhelp: [
		`/roll [dice notation] - Rolls dice using standard dice notation.`,
		`Examples:`,
		`/roll d6 - Roll a single 6-sided die`,
		`/roll 2d20 - Roll two 20-sided dice`,
		`/roll 3d10+5 - Roll three 10-sided dice and add 5`,
		`/roll 4d6-2 - Roll four 6-sided dice and subtract 2`,
		`Supports 1-100 dice, 2-10000 sides, and modifiers from -10000 to 10000.`,
		`Common shortcuts: /d4, /d6, /d8, /d10, /d12, /d20, /d100`,
	],

	// Shorthand commands for common dice
	d4(target, room, user) {
		const count = parseInt(target) || 1;
		if (count < 1 || count > 100) {
			return this.errorReply("Number of dice must be between 1 and 100.");
		}
		this.parse(`/roll ${count}d4`);
	},
	d6(target, room, user) {
		const count = parseInt(target) || 1;
		if (count < 1 || count > 100) {
			return this.errorReply("Number of dice must be between 1 and 100.");
		}
		this.parse(`/roll ${count}d6`);
	},
	d8(target, room, user) {
		const count = parseInt(target) || 1;
		if (count < 1 || count > 100) {
			return this.errorReply("Number of dice must be between 1 and 100.");
		}
		this.parse(`/roll ${count}d8`);
	},
	d10(target, room, user) {
		const count = parseInt(target) || 1;
		if (count < 1 || count > 100) {
			return this.errorReply("Number of dice must be between 1 and 100.");
		}
		this.parse(`/roll ${count}d10`);
	},
	d12(target, room, user) {
		const count = parseInt(target) || 1;
		if (count < 1 || count > 100) {
			return this.errorReply("Number of dice must be between 1 and 100.");
		}
		this.parse(`/roll ${count}d12`);
	},
	d20(target, room, user) {
		const count = parseInt(target) || 1;
		if (count < 1 || count > 100) {
			return this.errorReply("Number of dice must be between 1 and 100.");
		}
		this.parse(`/roll ${count}d20`);
	},
	d100(target, room, user) {
		const count = parseInt(target) || 1;
		if (count < 1 || count > 100) {
			return this.errorReply("Number of dice must be between 1 and 100.");
		}
		this.parse(`/roll ${count}d100`);
	},

	dice: 'roll',
	dicehelp: 'rollhelp',
};
