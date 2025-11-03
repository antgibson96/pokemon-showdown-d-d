# Client-Side Team Export Feature

## Overview
This feature adds a button to the battle UI that allows players to export their team with current HP values after a battle ends.

## Changes Made

### 1. Updated Team Interface (`battle-teams.ts`)
Added support for `hp` and `maxHP` properties in the `Teams.PokemonSet` interface:

```typescript
export interface FullPokemonSet {
    // ... existing properties ...
    /** Current HP value */
    hp?: number;
    /** Maximum HP value */
    maxHP?: number;
}
```

### 2. Updated Pack/Unpack Methods
- **`pack()`**: Serializes `hp` and `maxHP` as the 7th and 8th comma-separated values in the packed format
- **`unpack()`**: Deserializes `hp` and `maxHP` from the packed format

### 3. Updated Export/Import Methods
- **`exportSet()`**: Displays HP as `HP: 75/115` (current/max) or `HP: 75` (current only)
- **`parseExportedTeamLine()`**: Parses both `HP: 75` and `HP: 75/115` formats

### 4. Added Export Button to Battle UI (`panel-battle.tsx`)

#### New Handler Method
Added `handleExportTeam()` method that:
1. Retrieves current Pokemon data from `battle.myPokemon`
2. Converts `ServerPokemon[]` to `Teams.PokemonSet[]`
3. Captures current HP and maxHP values
4. Exports the team using `Teams.export()`
5. Copies the exported team to clipboard
6. Shows a confirmation alert

#### UI Changes
Added a new button in `renderAfterBattleControls()`:
- Appears next to "Upload and share replay" button
- Only visible to battle participants (when `room.side` exists)
- Icon: `fa-list`
- Label: "Export team with HP"

## Usage

1. Complete a battle (win, loss, or tie)
2. Click the "Export team with HP" button in the post-battle controls
3. The team will be exported with current HP values and copied to your clipboard
4. A confirmation alert will appear
5. Paste the team into a text file or team builder

## Example Output

```
Pikachu (M) @ Light Ball
Ability: Lightning Rod
- Thunderbolt
- Iron Tail
- Quick Attack
- Thunder Wave
HP: 75/115
Level: 50
Shiny: Yes
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
IVs: 0 Atk

...
```

## Technical Notes

### Data Flow
1. Battle ends → `renderAfterBattleControls()` displays button
2. User clicks → `handleExportTeam()` triggered
3. Handler accesses `battle.myPokemon` (array of `ServerPokemon`)
4. Each `ServerPokemon` contains:
   - `hp`: Current HP value
   - `maxhp`: Maximum HP value
   - `speciesForme`: Species name
   - `name`: Nickname
   - `item`: Held item
   - `ability`: Current ability
   - `baseAbility`: Original ability
   - `moves`: Array of move names
   - `level`: Pokemon level
   - `gender`: 'M', 'F', or 'N'
   - `shiny`: Boolean
5. Converted to `Teams.PokemonSet` format
6. Exported using `Teams.export()`
7. Copied to clipboard via `navigator.clipboard.writeText()`

### Backward Compatibility
- Teams without HP values work as before
- Existing team import/export is fully compatible
- Packed format supports optional HP values

## Files Modified

1. `pokemon-showdown-client/play.pokemonshowdown.com/src/battle-teams.ts`
   - Added `hp` and `maxHP` to `FullPokemonSet` interface
   - Updated `pack()` method (lines ~118-125)
   - Updated `unpack()` method (lines ~256-263)
   - Updated `exportSet()` method (lines ~394-401)
   - Updated `parseExportedTeamLine()` method (lines ~491-500)

2. `pokemon-showdown-client/play.pokemonshowdown.com/src/panel-battle.tsx`
   - Added `Teams` import (line ~9)
   - Added `handleExportTeam()` method (lines ~1041-1075)
   - Updated `renderAfterBattleControls()` to include export button (lines ~995-998)

## Testing

To test the feature:
1. Start a battle (e.g., against the AI or in a challenge)
2. Complete the battle
3. Look for the "Export team with HP" button
4. Click it and verify:
   - Team is copied to clipboard
   - Alert confirms success
   - Pasted team shows HP values like `HP: 75/115`
5. Import the team to verify it parses correctly
