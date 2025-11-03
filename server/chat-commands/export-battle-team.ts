/**
 * Chat commands for exporting battle teams
 * @author
 * @license MIT
 */

import {Utils} from '../../lib';

export const commands: Chat.ChatCommands = {
	async exportbattleteam(target, room, user) {
		if (!room) return this.errorReply("This command must be used in a battle room.");
		if (room.type !== 'battle') {
			return this.errorReply("This command can only be used in battle rooms.");
		}

		const battle = room.battle;
		if (!battle) return this.errorReply("No battle found in this room.");

		// Check if user is a player
		const player = battle.playerTable[user.id];
		if (!player) {
			return this.errorReply("You are not a player in this battle.");
		}

		// Get the player's team
		const team = await battle.getTeam(user);
		if (!team) {
			return this.errorReply("Could not retrieve your team.");
		}

		// Export the team
		const exported = Teams.export(team);
		const packed = Teams.pack(team);

		// Send to user
		this.sendReplyBox(
			`<details open><summary><strong>Your Battle Team</strong></summary>` +
			`<p><strong>Export format:</strong></p>` +
			`<code style="display: block; white-space: pre-wrap; overflow-x: auto;">${Utils.escapeHTML(exported)}</code>` +
			`<p><strong>Packed format:</strong></p>` +
			`<code style="display: block; word-break: break-all;">${Utils.escapeHTML(packed)}</code>` +
			`<p><em>Note: This exports your team as it was at the start of the battle. ` +
			`To save HP values, the client would need to be updated.</em></p>` +
			`</details>`
		);
	},
	exportbattleteamhelp: [
		`/exportbattleteam - Exports your current battle team. Can be used during or after a battle.`,
	],
};
