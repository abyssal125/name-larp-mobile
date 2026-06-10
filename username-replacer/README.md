# Username Replacer

A Revenge/Kettu plugin that replaces username "ngsr" with "emo" and injects custom badges (Early Supporter and Nitro) for a specific user.

## Installation

1. Copy the plugin folder to your device
2. Open Revenge/Kettu settings
3. Navigate to Plugins section
4. Tap "Add Plugin" or "Load from File"
5. Select the plugin folder or manifest.json
6. Enable the plugin

## Configuration

Before using the plugin, update the `TARGET_USER_ID` constant in `index.tsx` with the actual Discord user ID of the target user:

```typescript
const TARGET_USER_ID = "YOUR_ACTUAL_USER_ID_HERE";
```

## Verification Checklist

- Plugin loads without errors in console
- Username "ngsr" displays as "emo" in all UI locations:
  - [ ] Profiles
  - [ ] User cards
  - [ ] Member list
  - [ ] DM list
  - [ ] Message usernames
  - [ ] Search results
  - [ ] Settings/account screens
- Early Supporter badge appears for target user
- Nitro badge appears for target user
- Existing badges are preserved
- No duplicate badges appear
- Plugin unloads cleanly without errors
- No UI flickering or freezes
- Discord remains stable and responsive

## Technical Details

- Uses `after` patches on UserStore.getUser and ProfileModule.getUserProfile to maintain Discord's internal reactivity
- Uses unified patches array for safe cleanup
- Uses user ID as primary identifier to avoid race conditions
- Creates shallow copies with Object.assign to prevent cache mutation
- Defensive null checks throughout to prevent crashes
