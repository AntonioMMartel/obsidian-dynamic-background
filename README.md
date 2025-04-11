![image](https://github.com/user-attachments/assets/f96e5c3b-ff18-4a5b-8c30-affff5b58a53)# Dynamic Background Plugin

An [Obsidian](https://obsidian.md) plugin for adding dynamic effects and/or static wallpapers for Obsidian background.

## Features

- Adding dynamic effects for Obsidian background.
- Adding static wallpapers for Obsidian background.
- Adding dynamic effects and static wallpapers for Obsidian background. 

This plugin provides the following dynamic effects:

- 5 dynamic effects for Obsidian dark theme
  - Matrix / Digital Rain
  - Rain
  - Random Circle
  - Snow
  - Star Sky
- 2 dynamic effects for Obsidian light theme
  - Random Circle
  - Wave

> **Note:** Please report any bugs or needs by opening a new issue on GitHub.

## Demo

### Matrix / Digital Rain dynamic effect

![Digital rain dynamic effect](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/digital-rain-dark-effect.gif)

### Rain dynamic effect

![Rain dynamic effect](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/rain-effect.gif)

### Rain dynamic effect with wallpaper

![Rain dynamic effect with wallpaper](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/rain-effect-with-wallpaper.gif)

### Snow dynamic effect

![Snow dynamic effect](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/snow-effect.gif)

### Snow dynamic effect with wallpaper

![Snow dynamic effect with wallpaper](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/snow-effect-with-wallpaper.gif)


### Wave dynamic effect

![Wave dynamic effect](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/wave-effect.gif)

### Wave dynamic effect with wallpaper

![Wave dynamic effect with wallpaper](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/wave-effect-with-wallpaper.gif)

### Wallpaper demo 1

![Wallpaper demo 1](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/wallpaper-demo-1.png)

### Wallpaper demo 2

![Wallpaper demo 2](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/wallpaper-demo-3.png)


## How to use

### Open setting window

- Click the `Settings` button on the left toolbar
- Slide the scroll bar in the pop-up dialog and click `Dynamic Background` in the Community Plugins group

Please see the video below for details:

![Blue Sky](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/open-plugin-settings-window.gif)

### Enable or Disable dynamic effect

Dynamic effect can be enabled or disabled at any time:

- [Open the plugin's settings window](#open-setting-window)
- Close the `Enable Dynamic Effect` switch

### Select dynamic effect

There are a variety of dynamic effects to choose from, please choose a dynamic effect according to your `Base theme` setting. You can set the `Base theme` or `Base color scheme` by following the steps below.

- Click the `Settings` button on the left toolbar
- Click the `Appearance` button (As shown in the figure below, number 1)
- Select a theme as you need (as shown in the figure below, number 2)

![Select Obsidian Base Theme](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/select-obsidian-base-theme.jpg)


If your `Base theme` or `Base color scheme` setting is **Dark**, you should choose a dynamic effect from the Dark series. If your `Base theme` or `Base color scheme` setting is **Light**, you should choose a dynamic effect from the Light series.

The steps to select a dynamic effect are as follows:

- [Open the plugin's settings window](#open-setting-window)
- Select a effect from the `Dynamic Effect` drop-down box

### Select wallpaper image file

You can specify a image file inside Vault as the wallpaper, please use the relative path of the image file inside Vault.

- Example: `attachments/moon.jpg` or `wallpapers/green.png`

> **Note:** Sometimes you may just want to display the wallpaper without the dynamic effect, just turn off the `Enable Dynamic Effect` switch in the settings window.

### Set wallpaper blur

[Open the plugin's settings window](#open-setting-window), Set the blur value, 0 means no blur. The blur effect is shown as follows:

**Blur: 0**

![Wallpaper blur 0](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/wallpaper-blur-0.png)

**Blur: 5**

![Wallpaper blur 5](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/wallpaper-blur-5.png)

**Blur: 10**

![Wallpaper blur 10](https://raw.githubusercontent.com/samuelsong70/obsidian-dynamic-background/master/assets/wallpaper-blur-10.png)

## New features

### Improved settings
Now we can adjust more settings
- Color
- Brightness
- Background blending
- Individual settings for notes

![New settings](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/new-settings.PNG)

### Brightness setting

[Open the plugin's settings window](#open-setting-window), Set the brightness value, 0 will make the background completely dark, 100 will make it have its normal brightness, 200 will make your eyes cry. The brightness effect is shown as follows:

**Brightness: 10**

![Brightness 10](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/brightness-example-10.PNG)

**Brightness: 50**

![Brightness 50](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/brightness-example-50.PNG)

**Brightness: 100**

![Brightness 100](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/brightness-example-100.PNG)

### Color setting + blend mode

Your can change the wallpaper color using the color picker (or by inputting the hexcode directly). The normal blending mode **does not** apply the color to the background. There are 15 different blending modes and some can be tried out here: [Playcss - Background blending modes](https://www.w3schools.com/cssref/playdemo.php?filename=playcss_background-blend-mode)

**Color picker**
![Color picker](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/color-picker.PNG)

**Select blending mode**

**Beach wallpaper with no color (brightness: 35, blur: 5)**
![Beach normal](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/beach-wallpaper-normal.PNG)

**Beach wallpaper with yellow color and hard light blending (brightness: 35, blur: 5)**
![Beach yellow hard light](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/beach-wallpaper-yellow-hard-light.PNG)

**Beach wallpaper with blue color and multiply blending (brightness: 35, blur: 5)**
![Beach blue multiply](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/beach-wallpaper-multiply-blue.PNG)

**Wolf wallpaper with no color (brightness: 35, blur: 0)**
![Wolf normal](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/wolf-wallpaper-normal.PNG)

**Wolf wallpaper with yellow color and hard-light blending (brightness: 35, blur: 0)**
![Wolf yellow hard-light](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/wolf-wallpaper-yellow-hard-light.PNG)

**Wolf wallpaper with violet color and multiply blending (brightness: 35, blur: 5)**
![Wolf violet multiply](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/wolf-wallpaper-violet-multiply-blur.PNG)

### Set specific background and dynamic effect to a note
You can now set individual wallpapers and dynamic effects to your notes. 

**Add background settings to note**
With a reset button if you want to start over or the save button to save the settings
- Dont forget that full file extensions must be used. Example: `mycoolnote.md` or `verycoolbackground.jpg`

![Add settings preview](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/add-note-setting.PNG)

**Background settings list**
This is where you will see all the settings that you have saved across your notes. You can change them to your hearts contempt and save if you are happy or undo your changes if you are not. 

![Settings list preview](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/settings-list-preview.PNG)

**Settings list priority**
Want to stack multiple settings because **aesthetics**? Then you must know how the settings list prioritizes one setting over the other.
- The lower it is in the list the higher priority the setting has

![Priorities example](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/note-path-priority-example.PNG)

**Example of correct settings**
Here we have several stacked settings:
- Folder: A folder filled with notes that will have image.png as background
- Folder/coolnote.md: A note inside Folder that will have a different image from all the other images in folder
- Folder/AnotherFolder: A folder that will have different settings from Folder

![Priorities correct](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/priorities-example.PNG)

**Example of incorrect settings**
The same stacked settings:
- But now the setting of Folder/AnotherFolder is overriden by that of Folder

![Priorities wrong](https://raw.githubusercontent.com/AntonioMMartel/obsidian-dynamic-background/master/assets/priorities-wrong-example.PNG)

**The settings list is draggable**
Pressing the left mouse button for more than half a second will make it so that the note setting is draggable and moved to another position in the list


## How to Install

### From within Obsidian

From Obsidian, you can activate this plugin within Obsidian by doing the following:

- Open Settings > Community plugins
- Make sure Restricted mode is **off**
- Click Browse community plugins
- Search for "Dynamic Background"
- Click Install
- Once installed, close the community plugins window and activate the newly installed plugin

### From GitHub

- Download `main.js`, `manifest.json`, `styles.css` from the Releases section of the GitHub Repository.
- Create `obsidian-dynamic-background` folder under `<vault>/.obsidian/plugins/` folder.
- Copy downloaded files to `<vault>/.obsidian/plugins/obsidian-dynamic-background/` folder.  
  
  >Note: On some machines the `.obsidian` folder may be hidden. On MacOS you should be able to press `Command+Shift+Dot` to show the folder in Finder.

- Reload Obsidian

## Version History

### 1.1.0
- Feature where user can set specific background settings for notes
- Improved settings menu (+color picker, +sortable list, +text input in sliders)

### 1.0.7
- Merge dangtrivan code
- Implementation and configurable settings for color, color blending and brightness

### 1.0.6

- Fixed an issue where static wallpapers could not be displayed after upgrading to Obsidian v1.2.8 or later.

### 1.0.5

- Added brightness control for Matrix / Digital Rain dynamic effect.

### 1.0.4

- Improved Matrix / Digital Rain dynamic effect.

### 1.0.3

- Add Matrix / Digital Rain dynamic effect for Obsidian dark theme.

### 1.0.2

- Initial version

## Support

This plugin is provided to everyone for free. 

If you like this plugin, welcome to support us. I will keep improving this plugin to make it better and better.

<a href="https://www.buymeacoffee.com/samuelsong"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=codetab&button_colour=e3e7ef&font_colour=262626&font_family=Inter&outline_colour=262626&coffee_colour=ff0000"></a>

