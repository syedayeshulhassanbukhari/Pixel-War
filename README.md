<div align="center">

<img src="assets/icon.png" width="96" alt="Pixel War icon">

# PIXEL WAR

**A pixel-art action campaign for Android**

Five cursed worlds &middot; fifteen stages &middot; five bosses &middot; eight weapons &middot; hand-animated pixel effects

[**Website**](https://syedayeshulhassanbukhari.github.io/Pixel-War/) &nbsp;&middot;&nbsp;
[**Download the APK**](downloads/PixelWar.apk) &nbsp;&middot;&nbsp;
[**Developer portfolio**](https://syedayeshulhassanbukhari.github.io/sudo-ayesh/#hero)

![Platform](https://img.shields.io/badge/platform-Android%207.0%2B-ffc23d?style=flat-square&labelColor=0b0a12)
![Engine](https://img.shields.io/badge/engine-Godot%204.7-8fd6ff?style=flat-square&labelColor=0b0a12)
![Size](https://img.shields.io/badge/APK-55%20MB-c684ff?style=flat-square&labelColor=0b0a12)
![Price](https://img.shields.io/badge/price-free-8cf08c?style=flat-square&labelColor=0b0a12)

<img src="img/shot_boss_void.png" width="820" alt="Fighting the Eye of the Void with a greatsword">

</div>

---

## About

Cut through five worlds as an armoured knight. Pick from eight weapons, call down lightning and meteors, freeze whole waves, and break five bosses, with every spark hand-animated, frame by frame. Pixel War is a side-view arena action game built for phones: multi-touch controls, every screen shape from 4:3 tablets to 21:9 phones, and short stages you can clear in a couple of minutes.

## Features

| | |
|---|---|
| <img src="assets/ui/ic_meteor.png" width="40"> **Hand-animated effects** | Every flame, bolt, splash and shatter is a frame-by-frame pixel effect, not a particle blur. |
| <img src="assets/ui/ic_hammer.png" width="40"> **Eight weapons** | Sword, daggers, claws, spear, whip, hammer, greatsword and scythe, each with its own swing, reach and hit timing. |
| <img src="assets/ui/skull.png" width="40"> **Boss fights** | Five bosses with readable telegraphs: a ring on the floor fills up, then the strike lands. They get angry at half health. |
| <img src="assets/ui/ic_lightning.png" width="40"> **Six skills** | Fireball, lightning, frost nova, meteor and heal unlock as you clear stages. Fire melts ice; frozen enemies shatter. |
| <img src="assets/ui/star.png" width="40"> **Stars and upgrades** | Three stars per stage: clear it, stay healthy, beat par time. Spend coins on skills, health and new weapons. |
| <img src="assets/ui/ic_nova.png" width="40"> **Made for phones** | Multi-touch controls, notch-safe HUD, adjustable button size, with keyboard and gamepad support too. |

## Five worlds

<table>
<tr>
<td width="50%"><img src="img/world_crypt.png" alt="Ashen Crypt"><br><b>1 &middot; Ashen Crypt</b><br>Torch-lit halls of slimes, bats and ghosts. <i>Boss: King Slime</i></td>
<td width="50%"><img src="img/world_frost.png" alt="Frostbite Cavern"><br><b>2 &middot; Frostbite Cavern</b><br>Falling icicles, frost slimes and ghosts. <i>Boss: Frost Wraith</i></td>
</tr>
<tr>
<td><img src="img/world_forest.png" alt="Thornwood"><br><b>3 &middot; Thornwood</b><br>Poison clouds, frogs, snakes and birds. <i>Boss: Elder Toad</i></td>
<td><img src="img/world_forge.png" alt="Ember Forge"><br><b>4 &middot; Ember Forge</b><br>Flame vents, magma slimes and diving wisps. <i>Boss: Inferno Skull</i></td>
</tr>
<tr>
<td colspan="2" align="center"><img src="img/world_void.png" width="50%" alt="Void Rift"><br><b>5 &middot; Void Rift</b><br>Shadow hands and lightning storms. <i>Boss: Eye of the Void</i></td>
</tr>
</table>

## The arsenal

| | Weapon | Price | Style |
|---|---|---|---|
| <img src="assets/ui/ic_sword.png" width="32"> | **Sword** | starter | Fast and reliable |
| <img src="assets/ui/ic_daggers.png" width="32"> | **Daggers** | 90 | Seven quick stabs, high crit chance |
| <img src="assets/ui/ic_claws.png" width="32"> | **Claws** | 120 | Three rakes, short but relentless |
| <img src="assets/ui/ic_spear.png" width="32"> | **Spear** | 150 | Long reach, sweeps behind you too |
| <img src="assets/ui/ic_whip.png" width="32"> | **Whip** | 180 | The longest reach, stuns |
| <img src="assets/ui/ic_hammer.png" width="32"> | **Hammer** | 260 | Slow, crushes and stuns everything near |
| <img src="assets/ui/ic_greatsword.png" width="32"> | **Greatsword** | 320 | A huge, wide, heavy cleave |
| <img src="assets/ui/ic_scythe.png" width="32"> | **Scythe** | 400 | Reaps both sides, heals you a little |

## Screenshots

<table>
<tr>
<td><img src="img/shot_boss_toad.png" alt="The Elder Toad boss"></td>
<td><img src="img/shot_frost.png" alt="Dagger flurry in the Frostbite Cavern"></td>
</tr>
<tr>
<td><img src="img/shot_fight.png" alt="Touch controls during a fight"></td>
<td><img src="img/shot_armory.png" alt="The Armory"></td>
</tr>
</table>

## Install

1. Download [**PixelWar.apk**](downloads/PixelWar.apk) on your Android phone (Android 7.0 or newer, 64-bit).
2. Open it. If Android asks, allow installs from your browser or file manager.
3. Play. Progress saves automatically.

**Controls:** on-screen arrows and skill buttons on phones. On a keyboard, `A`/`D` to move, `J K L U I O` for skills and `Esc` to pause. Gamepads work too.

## This repository

This is the game's website, served by GitHub Pages: plain HTML, CSS and JavaScript, with no build step. It draws with the game's own art:

- headings in the game's 5&times;7 pixel font, from its bitmap sheet
- the game's 9-slice buttons and studded panels, via CSS `border-image`
- live sprite sheets of the knight, critters and spell effects, played on `<canvas>`

To run it locally: `python -m http.server` in this folder, then open http://localhost:8000.

## Credits

**Designed and developed by Ayesh Ul Hassan** ([sudo-ayesh](https://syedayeshulhassanbukhari.github.io/sudo-ayesh/#hero)), game developer working in Unreal Engine 5, Roblox and Unity.

[Portfolio](https://syedayeshulhassanbukhari.github.io/sudo-ayesh/#hero) &middot; [itch.io](https://sudo-ayesh.itch.io/) &middot; [GitHub](https://github.com/syedayeshulhassanbukhari) &middot; [LinkedIn](https://www.linkedin.com/in/syedaishulhassan) &middot; [Fiverr](https://www.fiverr.com/syedaish)

Pixel effects and character rig: [pixelfx](https://github.com/patch-gg/pixelfx) &middot; Engine: [Godot 4.7](https://godotengine.org) &middot; Music and sound: original chiptune
