import { 
	App, 
	Modal, 
	Plugin, 
	PluginSettingTab, 
	Setting, 
	FileSystemAdapter, 
	normalizePath, 
	TextComponent, 
	DropdownComponent, 
	IconName,
	addIcon,
	Notice 
} from 'obsidian';
import { Add_StarSky, Remove_StarSky} from 'effects/dark-dynamic-star-sky';
import { Add_Snow, Remove_Snow, DarkTheme_Snow_Background_Property} from 'effects/dark-dynamic-snow';
import { Add_Rain, Remove_Rain, DarkTheme_Rain_Background_Property} from 'effects/dark-dynamic-rain';
import { Add_RandomCircle, Remove_RandomCircle, DarkTheme_Random_Circle_Background_Property} from 'effects/dark-dynamic-random-circle';
import { Add_RandomCircle_Light, Remove_RandomCircle_Light, LightTheme_Random_Circle_Background_Property} from 'effects/light-dynamic-random-circle';
import { Add_Wave_Light, Remove_Wave_Light, LightTheme_Wave_Background_Property} from 'effects/light-dynamic-wave';
import { Add_DigitalRain, Remove_DigitalRain, DarkTheme_Digital_Rain_Background_Property, SetBrightness} from 'effects/dark-dynamic-digital-rain';
import { DynamicEffectEnum } from 'common';
import { DynamicBackgroundPluginSettings } from 'common';
import * as fs from 'fs';
import * as path from 'path';

import Sortable from "sortablejs"


const DEFAULT_SETTINGS: DynamicBackgroundPluginSettings = {
	dynamicEffect: DynamicEffectEnum.Dark_StarSky,
	digitalRainBrightness: 0.7,
	enableDynamicEffect: true,
	backgroundImageFile:"",
	blur:0,
	notesBackgroundMap: []
} 

export default class DynamicBackgroundPlugin extends Plugin {
	settings: DynamicBackgroundPluginSettings;
	preDynamicEffect: DynamicEffectEnum;
	preBackgroudImageFile: boolean;
	dynamicBackgroundContainer: HTMLDivElement|null;
	wallpaperCover: HTMLDivElement;
	
	async onload() {
		console.log("loading dynamic background plugin...");
		this.preDynamicEffect = DynamicEffectEnum.Unknown;
		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new DynamicBackgroundSettingTab(this.app, this));
		// Layout
		this.app.workspace.onLayoutReady(() => {
			this.AddDynamicBackgroundContainer();
			this.SetDynamicBackgroundContainerBgProperty();
			if(this.settings.enableDynamicEffect == true){
				this.AddDynamicBackgroundEffect(this.settings.dynamicEffect);
				this.preDynamicEffect = this.settings.dynamicEffect
				//this.RemoveDynamicBackgroundEffect(this.preDynamicEffect)
				//this.AddDynamicBackgroundEffect(DynamicEffectEnum.Dark_DigitalRain)
			}
		});

		// File open
		this.app.workspace.on('file-open', () => {
			const file = this.app.workspace.getActiveFile()
			if(file){
				this.setFileBackground(file)
			}
		})

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		//this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log("unloading dynamic background plugin...");

		this.RemoveDynamicBackgroundContainer();
	}

	async setFileBackground(file: Object) {
		// If file has backgroung in config

		// set background

		// Else use default background

	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	AddDynamicBackgroundContainer(){
  	let div_root = this.app.workspace.containerEl.find("div.workspace > div.mod-root");
		
		this.dynamicBackgroundContainer = null;

  	if (div_root) {
    	this.dynamicBackgroundContainer = div_root.createEl("div", { cls: "rh-obsidian-dynamic-background-container" });

			this.wallpaperCover = this.dynamicBackgroundContainer.createEl("div", { cls: "rh-wallpaper-cover" });

			this.SetWallpaperBlur();
  		}
	}

	SetWallpaperBlur(){
		let value = "blur("+this.settings.blur.toString()+"px)";
		this.wallpaperCover.style.setProperty("filter",value);
	}

	RemoveDynamicBackgroundContainer(){
		if (this.dynamicBackgroundContainer)
		{
			this.dynamicBackgroundContainer.remove();
			this.dynamicBackgroundContainer = null;
		}
	}

	async SetDynamicBackgroundContainerBgProperty(){
		if (this.dynamicBackgroundContainer == null)
			return;

		let backgroundImageAlreadySet = false;	
		let imageFullFilename="";

		try {
            imageFullFilename = this.app.vault.adapter.getResourcePath(this.settings.backgroundImageFile)

        } catch(e) { }
		
		if (imageFullFilename!=""){
			this.dynamicBackgroundContainer.style.setProperty("background","url(\"" + imageFullFilename + "\"");
			this.dynamicBackgroundContainer.style.setProperty("background-size","cover");
			this.dynamicBackgroundContainer.style.setProperty("background-position","center");

			backgroundImageAlreadySet = true;
		}
		else{
			this.dynamicBackgroundContainer.style.removeProperty("background");
			this.dynamicBackgroundContainer.style.removeProperty("background-size");
			this.dynamicBackgroundContainer.style.removeProperty("background-position");
		}

		if (backgroundImageAlreadySet == false){
			this.dynamicBackgroundContainer.style.removeProperty("background");
			this.dynamicBackgroundContainer.style.removeProperty("background-size");
			this.dynamicBackgroundContainer.style.removeProperty("background-position");

			if(this.settings.enableDynamicEffect == false)
				return;

			switch(this.settings.dynamicEffect){
				case DynamicEffectEnum.Dark_StarSky:
					break;
				case DynamicEffectEnum.Dark_Snow:
					this.dynamicBackgroundContainer.style.setProperty("background", DarkTheme_Snow_Background_Property);
					break;
				case DynamicEffectEnum.Dark_Rain:
					this.dynamicBackgroundContainer.style.setProperty("background", DarkTheme_Rain_Background_Property);
					break;
				case DynamicEffectEnum.Dark_RandomCircle:
					this.dynamicBackgroundContainer.style.setProperty("background", DarkTheme_Random_Circle_Background_Property);
					break;
				case DynamicEffectEnum.Light_RandomCircle:
					this.dynamicBackgroundContainer.style.setProperty("background", LightTheme_Random_Circle_Background_Property);
					break;
				case DynamicEffectEnum.Light_Wave:
					this.dynamicBackgroundContainer.style.setProperty("background", LightTheme_Wave_Background_Property);
					break;
				case DynamicEffectEnum.Dark_DigitalRain:
					this.dynamicBackgroundContainer.style.setProperty("background", DarkTheme_Digital_Rain_Background_Property);
			}
		}
	}

	SetDigitalRainBrightnessHelper(){
		if (this.dynamicBackgroundContainer){
			SetBrightness(this.dynamicBackgroundContainer, this.settings.digitalRainBrightness);
		}
	}

	AddDynamicBackgroundEffect(effect: DynamicEffectEnum) {
		switch(effect){
			case DynamicEffectEnum.Dark_StarSky:
				if (this.dynamicBackgroundContainer)
					Add_StarSky(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Dark_Snow:
				if (this.dynamicBackgroundContainer)
					Add_Snow(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Dark_Rain:
				if (this.dynamicBackgroundContainer)
					Add_Rain(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Dark_DigitalRain:
				if (this.dynamicBackgroundContainer)
				{
					Add_DigitalRain(this.dynamicBackgroundContainer);
					this.SetDigitalRainBrightnessHelper();
				}
				break;
			case DynamicEffectEnum.Dark_RandomCircle:
				if (this.dynamicBackgroundContainer)
					Add_RandomCircle(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Light_RandomCircle:
				if (this.dynamicBackgroundContainer)	
					Add_RandomCircle_Light(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Light_Wave:
				if (this.dynamicBackgroundContainer)
					Add_Wave_Light(this.dynamicBackgroundContainer);
				break;
		}
  };

	RemoveDynamicBackgroundEffect(effect:DynamicEffectEnum){
		if (effect == DynamicEffectEnum.Unknown)
			return;

		switch(effect)
		{
			case DynamicEffectEnum.Dark_StarSky:
				if (this.dynamicBackgroundContainer)
					Remove_StarSky(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Dark_Snow:
				if (this.dynamicBackgroundContainer)
					Remove_Snow(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Dark_Rain:
				if (this.dynamicBackgroundContainer)
					Remove_Rain(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Dark_DigitalRain:
				if (this.dynamicBackgroundContainer)
					Remove_DigitalRain(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Dark_RandomCircle:
				if (this.dynamicBackgroundContainer)
					Remove_RandomCircle(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Light_RandomCircle:
				if (this.dynamicBackgroundContainer)
					Remove_RandomCircle_Light(this.dynamicBackgroundContainer);
				break;
			case DynamicEffectEnum.Light_Wave:
				if (this.dynamicBackgroundContainer)
					Remove_Wave_Light(this.dynamicBackgroundContainer);
				break;
		}
  };
}

class DynamicBackgroundModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class DynamicBackgroundSettingTab extends PluginSettingTab {
	plugin: DynamicBackgroundPlugin;

	constructor(app: App, plugin: DynamicBackgroundPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		
		containerEl.empty();

		containerEl.createEl('h2', {text: 'Dynamic Background Plugin - Settings'});

		let defaultDynamicEffects = 
			{
				[DynamicEffectEnum.Dark_DigitalRain.toString()]: "Dark - Matrix / Digital Rain",
				[DynamicEffectEnum.Dark_Rain.toString()] : "Dark - Rain", 
				[DynamicEffectEnum.Dark_RandomCircle.toString()]: "Dark - Random Circle",
				[DynamicEffectEnum.Dark_Snow.toString()]: "Dark - Snow",
				[DynamicEffectEnum.Dark_StarSky.toString()]:"Dark - Star Sky",
				[DynamicEffectEnum.Light_RandomCircle.toString()]: "Light - Random Circle",
				[DynamicEffectEnum.Light_Wave.toString()]: "Light - Wave"
			}

		new Setting(containerEl)
			.setName('Default dynamic Effect')
			.setDesc('Select a default dynamic effect')
			.addDropdown((dropdown) => dropdown
				.addOptions(defaultDynamicEffects)
				//.addOptions(userAddedDynamicBackgrounds)	
				.setValue(this.plugin.settings.dynamicEffect.toString())
         		.onChange(async (value) => {
					this.plugin.preDynamicEffect = this.plugin.settings.dynamicEffect;
					this.plugin.settings.dynamicEffect = Number(value);
				
					await this.plugin.saveSettings();

					this.plugin.RemoveDynamicBackgroundEffect(this.plugin.preDynamicEffect);

					if (this.plugin.settings.enableDynamicEffect == true)
						this.plugin.AddDynamicBackgroundEffect(this.plugin.settings.dynamicEffect);

					this.plugin.SetDynamicBackgroundContainerBgProperty();

					this.display();
          		})
			);	

		if (this.plugin.settings.dynamicEffect == DynamicEffectEnum.Dark_DigitalRain)
		{
			new Setting(containerEl)
			.setName("Brightness")
			.setDesc("Set Digital Rain Brightness.")
			.addSlider(tc => {
				tc.setDynamicTooltip()
					.setLimits(0.50, 1, 0.01)
					.setValue(this.plugin.settings.digitalRainBrightness)
					.onChange(async value => {
						this.plugin.settings.digitalRainBrightness = value;
						this.plugin.SetDigitalRainBrightnessHelper();

						await this.plugin.saveSettings();
					});
			});	
		}

		new Setting(containerEl)
			.setName('Enable Dynamic Effect')
			.setDesc('Enable or disable dynamic effect')
			.addToggle((tc) => 
				tc.setValue(this.plugin.settings.enableDynamicEffect)
				.onChange(async(value) => {
					this.plugin.settings.enableDynamicEffect = value;
					
					await this.plugin.saveSettings();

					if (this.plugin.settings.enableDynamicEffect == false){
						this.plugin.RemoveDynamicBackgroundEffect(this.plugin.settings.dynamicEffect);
					}
					else{
						this.plugin.AddDynamicBackgroundEffect(this.plugin.settings.dynamicEffect);
					}
				})
			);				

		new Setting(containerEl)
			.setName('Static Wallpaper Image')
			.setDesc("Image file in Vault. Please use the relative path of the image file inside Vault.")
			.addTextArea((text) => text
				.setValue(this.plugin.settings.backgroundImageFile)
          		.setPlaceholder("Example: attachments/moon.jpg or wallpapers/green.png" )
				.then((cb) => {
					cb.inputEl.style.width = "100%";
					cb.inputEl.rows = 5;
				})
         	.onChange(async (value) => {
            	this.plugin.settings.backgroundImageFile = value;
				await this.plugin.saveSettings();
				this.plugin.SetDynamicBackgroundContainerBgProperty();
			})
      	);

		new Setting(containerEl)
			.setName('Blur')
			.setDesc('The blurriness of the wallpaper, 0 means no blur.')
			.addSlider(tc => {
				tc.setDynamicTooltip()
					.setLimits(0, 100, 1)
					.setValue(this.plugin.settings.blur)
					.onChange(async value => {
						this.plugin.settings.blur = value;
						await this.plugin.saveSettings();
						this.plugin.SetWallpaperBlur();
					});
			});	

		const noteBackgroundSetting = new Setting(containerEl)

		noteBackgroundSetting
			.setName('Add dynamic effect to note')
			.setDesc('Set specific dynamic effect for notes in specific path')
			.setClass("note-background-settings")

		const pathInput = new TextComponent(noteBackgroundSetting.controlEl)
		pathInput
			.setPlaceholder("Path to note")
			.inputEl.addClass("path-input-settings")

		
		let selectedDynamicEffect:string = DynamicEffectEnum.None.toString()
		const backgroundDropdown = new DropdownComponent(noteBackgroundSetting.controlEl)
		backgroundDropdown
			.addOptions({[DynamicEffectEnum.None.toString()]: "None"})
			.addOptions(defaultDynamicEffects)
			//.addOptions(userAddedDynamicBackgrounds)
			.setValue(selectedDynamicEffect)
			.onChange((value) => {
				selectedDynamicEffect = value
			})

		const imageInput = new TextComponent(noteBackgroundSetting.controlEl)
		imageInput
			.setPlaceholder("Path to background image")
			.inputEl.addClass("path-input-settings")



		addIcon("save-icon",'<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg>')
		noteBackgroundSetting
			.addButton((button) => {
				button
					.setClass("background-save-button")
					.setIcon("save-icon")
					.setTooltip("Save")
					.onClick(async (buttonEl : any) => {
						let notePath = pathInput.inputEl.value
						let dynamicEffect = backgroundDropdown.getValue()
						let backgroundPath = imageInput.inputEl.value

						if (notePath && backgroundPath && dynamicEffect) {
							this.plugin.settings.notesBackgroundMap.push({
								"notePath": notePath,
								"dynamicEffect": dynamicEffect,
								"backgroundPath": backgroundPath
							})
							new Notice("Note background saved successfully")
							await this.plugin.saveSettings()
							this.plugin.saveData(this.plugin.settings)
							this.display()
						} else if(!notePath) {
							new Notice("No note path has been added")
						} else if(!backgroundPath) {
							new Notice("No background path has been added")
						}
					})
			})

			
const pathsContainer = containerEl.createEl("div", {
			cls: "paths-container"
		})

		Sortable.create(pathsContainer, {
			animation: 500,
			ghostClass: "container-sortable-ghost",
			chosenClass: "container-sortable-chosen",
			dragClass: "container-sortable-drag",
			dragoverBubble: true,
			forceFallback: true,
			fallbackClass: "container-sortable-fallback",
			easing: "cubic-bezier(1, 0, 0, 1)",
			onSort: (command: { oldIndex: number; newIndex: number }) => {
				const arrayResult = this.plugin.settings.notesBackgroundMap;
				const [removed] = arrayResult.splice(command.oldIndex, 1);
				arrayResult.splice(command.newIndex, 0, removed);
				this.plugin.settings.notesBackgroundMap = arrayResult;
				this.plugin.saveSettings();
			}
		})
		
		this.plugin.settings.notesBackgroundMap.forEach((notePath) => {
			const settingItem = pathsContainer.createEl("div");
			settingItem.addClass("container-item-draggable");
			const settingIcon = settingItem.createEl("span");
			settingIcon.addClass("container-setting-icon");

			const vaultPath = (this.app.vault.adapter as any).basePath

			
			if(fs.existsSync(vaultPath + "/" + notePath.notePath) && fs.lstatSync(vaultPath + "/" + notePath.notePath).isDirectory()) {
				// Folder
				settingIcon.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-folder"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" /></svg>` 
				console.log("Folder")
			} else if (fs.existsSync(vaultPath + "/" + notePath.notePath + ".md") && fs.lstatSync(vaultPath + "/" + notePath.notePath + ".md").isFile()) {
				// File
				settingIcon.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>`	
				console.log("File")
			} else {
				//Not found
				settingIcon.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" /></svg>`
				console.log("None")
			}
			

			addIcon("delete-icon",`<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>`)
			
			new Setting(settingItem)
				.setClass("container-setting-item")
				.setName(notePath.notePath)
				.setDesc("Background: " + notePath.backgroundPath + " | Effect: " + notePath.dynamicEffect)
				.addButton((button) => {
					button
					.setClass("settings-button")
					.setClass("delete-settings-button")
					.setIcon("delete-icon")
					.setTooltip("Remove")
					/*.onClick(async () => {
					new Notice(`${notePath} assigned background deleted`);
					(this.app as any).commands.removeCommand(
						`highlightr-plugin:${highlighter}`
					);
					delete this.plugin.settings.highlighters[highlighter];
					this.plugin.settings.highlighterOrder.remove(highlighter);
					setTimeout(() => {
						dispatchEvent(new Event("Highlightr-NewCommand"));
					}, 100);
					await this.plugin.saveSettings();
					this.display();*/
            	}); 
		});
	}
}
