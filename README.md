# Dice Roller 3D

> Roll animated d6, d12 and d20 dice right from your toolbar — no table required.

**Dice Roller 3D** is a Chrome extension for quick tabletop rolls. Pick a die, hit **Roll**, and watch it tumble with a physics-inspired animation. A d6 renders as a true 3D cube, while the d12 and d20 use distinct polyhedral styling. Sound effects and a local roll history round it out.

## Features

- **Three die types** — d6 (cube), d12 (pentagon) and d20 (triangle), each with its own look and animation
- **Physics-inspired tumble** — parabolic arc, multi-axis rotation and natural deceleration on landing
- **Keyboard shortcut** — press `Space` or `Enter` to roll the selected die
- **Sound effects** — white-noise clatter while rolling and a clean ding on the result, with a mute toggle
- **Roll history** — the last rolls are listed in the popup for quick reference
- **No dependencies** — pure HTML, CSS 3D transforms and vanilla JavaScript
- **No permissions** — works entirely from the popup, offline, with no tracking

## Install (desktop Chrome)

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select this folder.
5. Click the extension's toolbar icon, choose a die and roll.

## Usage

1. Click the toolbar icon to open the dice roller.
2. Pick **d6**, **d12** or **d20** from the selector.
3. Click **Roll** (or press `Space` / `Enter`).
4. Read the result and check the **Last rolls** list for recent history.
5. Use the speaker button to mute or unmute sound effects.

## Privacy

Dice Roller 3D is a fully offline utility.

- The manifest declares **no permissions** and **no host permissions**.
- There are **no network requests**, no analytics and no trackers.
- The only stored data is your mute preference, kept in `localStorage`.

## How it works

- **`manifest.json`** — MV3 extension with a single toolbar popup.
- **`popup.html` / `popup.css`** — die selector, 3D die elements, result display and roll history.
- **`popup.js`** — random roll generation, CSS 3D animation sequencing, WebAudio sound effects and history rendering.

## Files

```
dice-roller-3d/
├── manifest.json    # MV3 config: toolbar popup, no permissions
├── popup.html       # Dice roller UI
├── popup.css        # 3D dice, animation and layout styles
├── popup.js         # Roll logic, animations, sound and history
├── docs/            # Preview images for the store listing
└── icons/           # 16 / 48 / 128 px extension icons
```
