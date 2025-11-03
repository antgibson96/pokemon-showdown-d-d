# Export Battle Team Feature

This document describes how to export teams from battles, including both the server-side command implementation and what would be needed for a client-side button.

## Server-Side Command

### `/exportbattleteam`

A chat command has been added that allows players to export their battle team during or after a battle.

**Usage:**
```
/exportbattleteam
```

**Features:**
- Can be used during an active battle or after it ends
- Exports the team in both human-readable and packed formats
- Only the player can export their own team (not opponents)
- Works in any battle room

**Example Output:**
The command will display a box with:
1. Export format (human-readable, for teambuilder)
2. Packed format (compressed, for storage/transmission)

**Note:** The current implementation exports the team as it was at the **start** of the battle. To include current HP values from the battle state, client-side changes would be needed (see below).

## Client-Side Button (Not Yet Implemented)

To add a button to the client that exports teams with current HP at the end of a battle, you would need to modify the **Pokemon Showdown Client** repository (separate from this server repository).

### What Would Be Needed:

#### 1. Client-Side Changes (`pokemon-showdown-client` repository)

**File: `js/client-battle.ts` (or equivalent)**

Add a button that appears when the battle ends:

```typescript
// When battle ends, add export button
onBattleEnd() {
    // Get current battle state with HP values
    const teamWithHP = this.battle.mySide.pokemon.map(pokemon => ({
        ...pokemon.set,  // Original set
        hp: pokemon.hp,  // Current HP
        maxHP: pokemon.maxhp  // Max HP
    }));
    
    // Show export button
    this.addExportButton(teamWithHP);
}

addExportButton(team: PokemonSet[]) {
    const button = $('<button class="button">Export Team (with HP)</button>');
    button.on('click', () => {
        const exported = Teams.export(team);
        // Show in a popup or copy to clipboard
        app.addPopup(ExportPopup, {
            team: exported
        });
    });
    this.$('.battle-controls').append(button);
}
```

#### 2. Protocol Changes

The client needs access to the final HP values. The server already sends this information in the battle log, but the client would need to:

1. Track HP changes throughout the battle
2. Store final HP values when the battle ends
3. Merge these with the original team data

#### 3. UI/UX Considerations

**Button Placement Options:**
- In the battle controls area (next to forfeit/timer buttons)
- In a post-battle summary screen
- As part of the replay controls

**Button Behavior:**
- Click to copy team to clipboard
- Click to show popup with export formats
- Option to save directly to teambuilder

### Example Client Implementation (Pseudocode)

```html
<!-- In battle.html or equivalent template -->
<div class="battle-end-controls" style="display: none;">
    <button class="button" name="exportTeamWithHP">
        <i class="fa fa-download"></i> Export Team (Current HP)
    </button>
    <button class="button" name="exportTeamFull">
        <i class="fa fa-download"></i> Export Team (Full HP)
    </button>
</div>
```

```javascript
// When battle ends
BattleRoom.prototype.updateControls = function() {
    if (this.battle && this.battle.ended) {
        $('.battle-end-controls').show();
    }
};

// Export with current HP
$('button[name="exportTeamWithHP"]').on('click', function() {
    const room = app.curRoom;
    const team = room.battle.mySide.pokemon.map(p => ({
        name: p.name,
        species: p.species,
        // ... other properties
        hp: p.hp,
        maxHP: p.maxhp
    }));
    
    const exported = Teams.export(team);
    app.addPopupMessage(`
        <div class="message">
            <h3>Your Team (Current HP)</h3>
            <textarea readonly>${exported}</textarea>
            <button class="button" onclick="this.previousElementSibling.select();document.execCommand('copy')">
                Copy to Clipboard
            </button>
        </div>
    `);
});
```

## Current Workaround

Until client-side changes are implemented, players can:

1. Use `/exportbattleteam` command in battle chat
2. Manually edit the exported team to add HP values
3. Use the format: `HP: current/max` (e.g., `HP: 75/115`)

## Technical Details

### Team Export Format with HP

When exporting with HP values, the format is:

```
Pikachu @ Light Ball
Ability: Static
Level: 50
HP: 75/115
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Thunderbolt
- Quick Attack
- Iron Tail
- Volt Switch
```

### Packed Format

In packed format, HP is stored as the 7th and 8th comma-separated values:
```
Pikachu||LightBall|Static|Thunderbolt,QuickAttack,IronTail,VoltSwitch|Timid|,,,252,4,252||||50|,,,,,,75,115
```

## Future Enhancements

Possible improvements:
- Auto-export teams at battle end
- Save battle states for later continuation
- Export opponent's team (in unrated/friendly battles)
- Include battle statistics with export
- Integration with replay system

## Related Documentation

- [HP Feature Documentation](./HP-FEATURE.md)
- [Teams Format Documentation](./sim/TEAMS.md)
- Client Repository: https://github.com/smogon/pokemon-showdown-client
