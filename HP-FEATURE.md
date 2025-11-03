# Saving Teams with Not-Full HP

This feature allows you to save Pokémon teams where some Pokémon are not at full health. This can be useful for:
- Saving game states
- Testing scenarios with damaged Pokémon
- Creating custom battle situations

## Export Format Example

You can now include an `HP:` line when exporting a Pokémon. The HP can be specified in two formats:

### Format 1: Current HP only
```
Pikachu @ Light Ball
Ability: Static
Level: 50
HP: 75
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Thunderbolt
- Quick Attack
- Iron Tail
- Volt Switch
```

### Format 2: Current/Max HP (recommended)
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

If omitted, the Pokémon is assumed to be at full HP.

## Packed Format

In the packed format, HP and maxHP are stored as the 7th and 8th values in the comma-separated metadata section:

```
Pikachu||LightBall|Static|Thunderbolt,QuickAttack,IronTail,VoltSwitch|Timid|,,,252,4,252||||50|,,,,,,75,115
```

The structure is:
```
NICKNAME|SPECIES|ITEM|ABILITY|MOVES|NATURE|EVS|GENDER|IVS|SHINY|LEVEL|HAPPINESS,POKEBALL,HIDDENPOWERTYPE,GIGANTAMAX,DYNAMAXLEVEL,TERATYPE,HP,MAXHP
```

## JSON Format

In the JSON format, HP and maxHP are simple numeric properties:

```json
{
  "name": "Pikachu",
  "species": "Pikachu",
  "item": "Light Ball",
  "ability": "Static",
  "moves": ["Thunderbolt", "Quick Attack", "Iron Tail", "Volt Switch"],
  "nature": "Timid",
  "evs": {"hp": 0, "atk": 0, "def": 0, "spa": 252, "spd": 4, "spe": 252},
  "ivs": {"hp": 31, "atk": 31, "def": 31, "spa": 31, "spd": 31, "spe": 31},
  "level": 50,
  "hp": 75,
  "maxHP": 115
}
```

## Usage Example

```javascript
const {Teams} = require('pokemon-showdown');

// Create a team with a Pokémon at 75/115 HP
const team = [{
  name: 'Pikachu',
  species: 'Pikachu',
  item: 'Light Ball',
  ability: 'Static',
  moves: ['Thunderbolt', 'Quick Attack', 'Iron Tail', 'Volt Switch'],
  nature: 'Timid',
  evs: {hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252},
  ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
  level: 50,
  hp: 75,     // Current HP
  maxHP: 115  // Maximum HP
}];

// Export to human-readable format
const exported = Teams.export(team);
console.log(exported);
// Output includes: HP: 75/115

// Pack for storage/transmission
const packed = Teams.pack(team);
console.log(packed);

// Unpack to restore
const restored = Teams.unpack(packed);
console.log(`${restored[0].hp}/${restored[0].maxHP}`); // "75/115"

// Import from text with HP
const importedTeam = Teams.import(`
Charizard @ Leftovers
Ability: Blaze
HP: 120/297
- Flamethrower
`);
console.log(importedTeam[0].hp);    // 120
console.log(importedTeam[0].maxHP); // 297
```

## Backward Compatibility

Teams without the HP field will continue to work exactly as before. Both `hp` and `maxHP` fields are optional:
- No HP specified = full HP (default behavior)
- HP only specified = shows just the current HP value
- HP and maxHP specified = shows as "current/max" format
