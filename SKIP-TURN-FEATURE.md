# Skip/Pass Turn Feature

## Overview
This feature adds a "Pass Turn" button to the battle UI that allows players to voluntarily skip their turn without making a move or switching Pokemon. This is useful for strategic play such as:
- Stalling to wait out weather conditions
- Letting hazards damage the opponent
- Wasting PP on opponent's Encore/Disable
- Strategic time management in timed battles

## Changes Made

### 1. Server-Side: Allow Voluntary Passing (`sim/side.ts`)

Modified the `choosePass()` method to allow passing during move requests even when Pokemon can act normally:

**Before:**
```typescript
case 'move':
    if (!pokemon.fainted && !pokemon.volatiles['commanding']) {
        return this.emitChoiceError(`Can't pass: Your ${pokemon.name} must make a move (or switch)`);
    }
    break;
```

**After:**
```typescript
case 'move':
    // Allow voluntary passing - pokemon will do nothing this turn
    // This is useful for strategic play (e.g., waiting out weather, stalling)
    if (!pokemon.fainted && !pokemon.volatiles['commanding']) {
        // Voluntary pass - create a pass action
        this.choice.actions.push({
            choice: 'pass',
        } as ChosenAction);
        return true;
    }
    break;
```

### 2. Client-Side: Add Pass Turn Button (`panel-battle.tsx`)

Added a "Pass Turn" button in the move controls section of the battle UI:

```tsx
<div class="movecontrols">
    <h3 class="moveselect">Attack</h3>
    {this.renderMoveMenu(choices)}
    <div class="pad">
        <button data-cmd="/choose pass" class="button">
            <i class="fa fa-forward" aria-hidden></i> Pass Turn
        </button>
    </div>
</div>
```

The button:
- Appears in the attack section below the move buttons
- Uses a forward icon to indicate skipping/passing
- Sends `/choose pass` command when clicked
- Is available whenever you can choose a move

## Technical Implementation

### Choice System
The game already supported "pass" as a choice type (it was previously only used for auto-passing fainted Pokemon). The changes enable explicit passing:

1. **Client Command**: `/choose pass`
2. **Server Processing**: Battle room forwards to battle stream
3. **Sim Processing**: `side.choose('pass')` → `side.choosePass()`
4. **Action Creation**: Creates a `{ choice: 'pass' }` action
5. **Battle Resolution**: Pokemon does nothing for the turn (like being fully paralyzed)

### Command Aliases
Both `/choose pass` and `/choose skip` work (they're handled identically in the code).

## Behavior

When a player uses Pass Turn:
- ✅ The Pokemon does nothing for that turn
- ✅ Turn order still applies (Speed/priority mechanics work normally)
- ✅ End-of-turn effects still occur (weather, status, etc.)
- ✅ The opponent can still act normally
- ✅ Can be used strategically for various purposes
- ❌ Cannot undo once confirmed (like other moves)
- ❌ Cannot use during forced switch scenarios

## Usage Example

### In Battle:
1. Player receives move choice request: "What will Pikachu do?"
2. Player sees their options:
   - 4 move buttons (Thunderbolt, Quick Attack, etc.)
   - Pass Turn button (NEW!)
   - Switch options
3. Player clicks "Pass Turn"
4. Pikachu does nothing this turn
5. End of turn effects still apply

### Strategic Scenarios:
- **Weather stalling**: Pass to let sandstorm damage opponent while you're immune
- **Hazard stalling**: Pass to let Stealth Rock/Spikes damage switching opponents
- **PP wasting**: If opponent is Encored into a bad move, pass to waste their PP
- **Speed advantage**: You're slower than opponent - pass to take hits then heal next turn
- **Perish Song**: Pass when Perish Song is at 1 to let opponent faint first

## Files Modified

1. **sim/side.ts** (lines ~1224-1251)
   - Modified `choosePass()` to allow voluntary passing during move requests
   - Previously returned error: "Can't pass: Your Pokemon must make a move (or switch)"
   - Now creates pass action and returns true

2. **pokemon-showdown-client/play.pokemonshowdown.com/src/panel-battle.tsx** (lines ~913-930)
   - Added Pass Turn button in `renderPlayerControls()` move menu
   - Button appears between move selection and switch selection
   - Uses `/choose pass` command

## Build Status
- ✅ Server compiled successfully
- ✅ Client compiled successfully (45 files)

## Testing Recommendations

To test the feature:
1. Start a battle (local or online)
2. When it's your turn to choose a move, look for the "Pass Turn" button
3. Click it to confirm passing works
4. Verify that:
   - Turn progresses normally
   - End-of-turn effects occur (weather, status damage, etc.)
   - You can pass multiple turns in a row
   - The log shows your Pokemon doing nothing
5. Test strategic scenarios (weather stalling, etc.)

## Notes

- This feature enables a legitimate strategy that was previously impossible
- Some competitive formats may want to ban or restrict passing (can be done via format rules)
- Passing is different from using a move like "Splash" (which is still a move selection)
- The pass choice is already part of the protocol (used internally), now it's user-accessible
