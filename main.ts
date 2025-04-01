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
	Notice,
	TFile,
	ButtonComponent,
	SliderComponent
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
import Pickr from '@simonwep/pickr';


const DEFAULT_SETTINGS: DynamicBackgroundPluginSettings = {
	dynamicEffect: DynamicEffectEnum.Dark_StarSky,
	digitalRainBrightness: 0.7,
	enableDynamicEffect: true,
	backgroundImageFile:"",
	blur:0,
	notesBackgroundMap: [],
	brightness: 100,
	backgroundColor: "",
	backgroundBlendMode: "",
	colorMap: [
		"#FFB8EBA6", // Pink
		"#FF5582A6", // Red
		"#FFB86CA6", // Orange
		"#FFF3A3A6", // Yellow
		"#BBFABBA6", // Green
		"#ABF7F7A6", // Cyan
		"#ADCCFFA6", // Blue
		"#D2B3FFA6", // Purple
		"#CACFD9A6", // Grey
	]

} 

export default class DynamicBackgroundPlugin extends Plugin {
	settings: DynamicBackgroundPluginSettings;
	preDynamicEffect: DynamicEffectEnum;
	preBackgroudImageFile: string;
	preBackgroundColor: string;
	preBackgroundBlur: number;
	preBackgroundBrightness: number;
	preBackgroundBlending: string;
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
			}
		});

		// File open
		this.app.workspace.on('file-open', async () => {
			const file = this.app.workspace.getActiveFile()
			if(file){
				await this.setFileBackgroundData(file)
			}
		})

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		//this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log("unloading dynamic background plugin...");
		this.RemoveDynamicBackgroundContainer();
	}

	async setFileBackgroundData(file: TFile) {
		let useDefaults: Boolean = true
		this.settings.notesBackgroundMap.forEach((note) => {
			// Found in settings
			if(file.path.contains(note.notePath) || file.path == note.notePath) {
				// background
				if(!(note.backgroundPath == "")){
					this.SetDynamicBackgroundContainerBgProperty(note.backgroundPath)
				}

				// dynamic effect
				this.RemoveDynamicBackgroundEffect(this.preDynamicEffect)
				this.AddDynamicBackgroundEffect(Number(note.dynamicEffect))
				this.preDynamicEffect = Number(note.dynamicEffect)
				useDefaults = false

				// color
				this.preBackgroundBlur = note.backgroundBlur
				this.preBackgroundBrightness = note.backgroundBrightness
				this.preBackgroundColor = note.backgroundColor
				this.preBackgroundBlending = note.backgroundBlend
				return;
			}
		})
		// Default
		if(useDefaults) {
			this.SetDynamicBackgroundContainerBgProperty()
			this.RemoveDynamicBackgroundEffect(this.preDynamicEffect)
			this.AddDynamicBackgroundEffect(this.settings.dynamicEffect)
			this.preDynamicEffect = this.settings.dynamicEffect
			this.preBackgroundBlur = this.settings.blur
			this.preBackgroundBrightness = this.settings.brightness
			this.preBackgroundColor = this.settings.backgroundColor
			this.preBackgroundBlending = this.settings.backgroundBlendMode
		}


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

		window.addEventListener('blur', () => {
			if (this.settings.enableDynamicEffect == true) {
				this.RemoveDynamicBackgroundEffect(this.settings.dynamicEffect);
			}
		});
		window.addEventListener('focus', () => {
			if (this.settings.enableDynamicEffect == true) {
				this.RemoveDynamicBackgroundEffect(this.settings.dynamicEffect);
				this.AddDynamicBackgroundEffect(this.settings.dynamicEffect);
			}
		});
	
    	this.dynamicBackgroundContainer = div_root.createEl("div", { cls: "rh-obsidian-dynamic-background-container" });

			this.wallpaperCover = this.dynamicBackgroundContainer.createEl("div", { cls: "rh-wallpaper-cover" });

			this.updateWallpaperStyles()
  		}
	}

	updateWallpaperStyles(){
		let value = "blur("+this.preBackgroundBlur.toString()+"px) brightness("+this.preBackgroundBrightness.toString()+"%)";
		this.wallpaperCover.style.setProperty("filter",value);
		this.wallpaperCover.style.setProperty("background-blend-mode", this.preBackgroundBlending);
		this.wallpaperCover.style.setProperty("background-color", this.preBackgroundColor);
	}

	RemoveDynamicBackgroundContainer(){
		if (this.dynamicBackgroundContainer)
		{
			this.dynamicBackgroundContainer.remove();
			this.dynamicBackgroundContainer = null;
		}
	}




	async SetDynamicBackgroundContainerBgProperty(imagePath = this.settings.backgroundImageFile){
		if (this.dynamicBackgroundContainer == null)
			return;

		let backgroundImageAlreadySet = false;	
		let imageFullFilename="";
		try {
            imageFullFilename = this.app.vault.adapter.getResourcePath(imagePath)

        } catch(e) { }
		
		if (imageFullFilename!=""){
			this.dynamicBackgroundContainer.style.setProperty("background","url(\"" + imageFullFilename + "\"");
			this.dynamicBackgroundContainer.style.setProperty("background-size","cover");
			this.dynamicBackgroundContainer.style.setProperty("background-position","center");

			this.preBackgroudImageFile = imagePath

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

		const defaultDynamicEffects = 
			{
				[DynamicEffectEnum.None.toString()]: "None",
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
			.addTextArea((text) => 
				text
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


		const defaultBlurSetting = new Setting(containerEl)
		defaultBlurSetting
			.setName('Default blur')
			.setDesc('The default blurriness of the wallpaper.')
		const defaultBlurText = new TextComponent(defaultBlurSetting.controlEl)
		const defaultBlurSlider = new SliderComponent(defaultBlurSetting.controlEl)
		defaultBlurText
			.inputEl.addClass("slider-text")
		defaultBlurText
			.setValue(this.plugin.settings.blur.toString())
			.setPlaceholder("0")
			.onChange(async value => {
				if(Number(value) > 100) value = "100"
				if(Number(value) < 0) value = "0"
				defaultBlurText.setValue(value)
				defaultBlurSlider.setValue(Number(value))
				this.plugin.settings.blur = Number(value);
				
				await this.plugin.saveSettings();

				this.plugin.updateWallpaperStyles();
			});
		defaultBlurSlider
			.setDynamicTooltip()
			.setLimits(0, 100, 1)
			.setValue(this.plugin.settings.blur)
			.onChange(async value => {
				this.plugin.settings.blur = value;
				defaultBlurText.setValue(value.toString())
				await this.plugin.saveSettings();
				this.plugin.updateWallpaperStyles();
			});


		const defaultBrightnessSetting = new Setting(containerEl)
		defaultBrightnessSetting
			.setName('Default brightness')
			.setDesc('The default brightness of the wallpaper.')
		const defaultBrightnessText = new TextComponent(defaultBrightnessSetting.controlEl)
		const defaultBrightnessSlider = new SliderComponent(defaultBrightnessSetting.controlEl)
		defaultBrightnessText
			.inputEl.addClass("slider-text")
		defaultBrightnessText
			.setValue(this.plugin.settings.brightness.toString())
			.setPlaceholder("0")
			.onChange(async value => {
				if(Number(value) > 200) value = "200"
				if(Number(value) < 0) value = "0"
				defaultBrightnessText.setValue(value)
				defaultBrightnessSlider.setValue(Number(value))
				this.plugin.settings.brightness = Number(value);
				
				await this.plugin.saveSettings();

				this.plugin.updateWallpaperStyles();
			});
		defaultBrightnessSlider
			.setDynamicTooltip()
			.setLimits(0, 200, 1)
			.setValue(this.plugin.settings.brightness)
			.onChange(async value => {
				this.plugin.settings.brightness = value;
				defaultBrightnessText.setValue(value.toString())
				await this.plugin.saveSettings();

				this.plugin.updateWallpaperStyles();
			});

		const defaultBackgroundColorSetting = new Setting(containerEl)
		defaultBackgroundColorSetting
			.setName("Background blend color")
			.setClass("color-setting")
			.setDesc(
				`Select the color using the color picker to set its hex code value`
			);
		const defaultBackgroundColorInput = new TextComponent(defaultBackgroundColorSetting.controlEl);
    	defaultBackgroundColorInput.inputEl.addClass("color-setting-value");
		defaultBackgroundColorInput
			.setPlaceholder("Color hex code")
			.setValue(this.plugin.settings.backgroundColor)
			.onChange((text) => {
				defaultBackgroundColorInput.inputEl.setAttribute("value", text)
				defaultBackgroundColorInput.inputEl.setAttribute("style", `background-color: ${text}; color: var(--text-normal);`)
			})
			.then((input) =>{
				defaultBackgroundColorInput.inputEl.setAttribute("value", this.plugin.settings.backgroundColor)
				defaultBackgroundColorInput.inputEl.setAttribute("style", `background-color: ${this.plugin.settings.backgroundColor}; color: var(--text-normal);`)
			})
		
		addIcon("undo-icon", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""> <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path> <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path> </svg> `)
		addIcon("save-icon",'<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="#ffffff"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg>')

		defaultBackgroundColorSetting
			.addButton((button) => {
				button.setClass("color-picker")
			})
			.then(() => {
				let input = defaultBackgroundColorInput.inputEl
				let currentColor = defaultBackgroundColorInput.inputEl.value || null
				let colorMap = this.plugin.settings.colorMap

				let colorHex;
				let pickrCreate = new Pickr({
					el: ".color-picker",
					theme: "nano",
					swatches: colorMap,
					defaultRepresentation: "HEXA",
					default: colorMap[colorMap.length - 1],
					comparison: false,
					components: {
						preview: true,
						opacity: true,
						hue: true,
						interaction: {
						hex: true,
						rgba: true,
						hsla: false,
						hsva: false,
						cmyk: false,
						input: true,
						clear: true,
						cancel: true,
						save: true,
						},
					},
				})
				pickrCreate
				.on("clear", function (instance: Pickr) {
					instance.hide()
					input.trigger("change")
				})
				.on("cancel", function (instance: Pickr) {
					currentColor = instance.getSelectedColor().toHEXA().toString();

					input.trigger("change");
					instance.hide();
				})
          		.on("change", function (color: Pickr.HSVaColor) {
					colorHex = color.toHEXA().toString();
					let newColor;
					colorHex.length == 6
					? (newColor = `${color.toHEXA().toString()}A6`)
					: (newColor = color.toHEXA().toString());

					input.setAttribute("value", newColor)
					input.setAttribute("style", `background-color: ${newColor}; color: var(--text-normal);`)

					input.setText(newColor);
					input.textContent = newColor;
					input.value = newColor;
					input.trigger("change");
				})
				.on("save", function (color: Pickr.HSVaColor, instance: Pickr) {
					let newColorValue = color.toHEXA().toString();

					input.setText(newColorValue);
					input.textContent = newColorValue;
					input.value = newColorValue;
					input.trigger("change");

					instance.hide();
					instance.addSwatch(color.toHEXA().toString());
				});
			})
			.addButton(button => {
				button
					.setClass("undo-button")
					.setIcon("undo-icon")
					.setTooltip("Undo")
					//.onClick()

			})
			.addButton((button) => {
				button
					.setClass("background-save-button")
					.setIcon("save-icon")
					.setTooltip("Save")
					.onClick(async (buttonEl : any) => {						
						await this.plugin.saveSettings()
						this.plugin.settings.backgroundColor = defaultBackgroundColorInput.inputEl.value
						this.plugin.saveData(this.plugin.settings)
						this.plugin.updateWallpaperStyles();
						new Notice("Default color set and saved successfully")
			})
		})
		
		const bgBlendingModeOptions = {
			"normal": "Normal",
			"multiply": "Multiply",
			"screen": "Screen",
			"overlay": "Overlay",
			"darken": "Darken",
			"lighten": "Lighten",
			"color-dodge": "Color Dodge",
			"color-burn": "Color Burn",
			"hard-light": "Hard Light",
			"soft-light": "Soft Light",
			"difference": "Difference",
			"exclusion": "Exclusion",
			"hue":"Hue",
			"saturation": "Saturation",
			"color": "Color",
			"luminosity": "Luminosity"
		}

		const backgroundBlendModeDescription = new DocumentFragment()
		backgroundBlendModeDescription.appendText("Check the multiple modes here: ")
		backgroundBlendModeDescription.createEl("a", {
			text: "Playcss - Background blend mode",
			href: "https://www.w3schools.com/cssref/playdemo.php?filename=playcss_background-blend-mode",
		});
		
		new Setting(containerEl)
			.setName('Background Blending Mode')
			.setDesc(backgroundBlendModeDescription)
			.addDropdown((dropdown) => 
			dropdown
				.addOptions(bgBlendingModeOptions)
				.setValue(this.plugin.settings.backgroundBlendMode)
				.onChange(async (value) => {
					this.plugin.settings.backgroundBlendMode = value;
					await this.plugin.saveSettings();
					this.plugin.updateWallpaperStyles();
				})
			)

		//addIcon("new-icon", `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" /><path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" /><path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" /><path d="M8.56 20.31a9 9 0 0 0 3.44 .69" /><path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" /><path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" /><path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" /><path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>`)

		const noteBackgroundInfo = new Setting(containerEl)
		noteBackgroundInfo
			.setName('Add dynamic effect to note')
			.setDesc('Set specific dynamic effect and background for notes in specific path. Paths should include the file extension. Eg: note.md')
			.setClass("note-background-settings")

		const noteBackgroundSetting = containerEl.createEl("div");
		noteBackgroundSetting.addClass("container-item-draggable");
		noteBackgroundSetting.addClass("container-item-draggable")

		const settingIcon = noteBackgroundSetting.createEl("div");
		settingIcon.addClass("setting-item-icon");
		settingIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""> <path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5"></path> <path d="M14 3v4a1 1 0 0 0 1 1h4"></path> <path d="M12 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v3.5"></path> </svg> `
		
		// Note path
		const notePathSetting = noteBackgroundSetting.createEl("div")
		notePathSetting.addClass("note-path-setting")

		const notePathLabel = notePathSetting.createEl("div")
		notePathLabel.addClass("setting-item-label")
		notePathLabel.textContent = "Note path"
		
		const notePathSettingInput = notePathSetting.createEl("input")
		notePathSettingInput.addClass("setting-item-input")
		notePathSettingInput.placeholder = "Path to note (Eg: note.md)"
		notePathSettingInput.type = "text"
		notePathSettingInput.value = ""
		
		// dyn effect
		const dynamicEffectSetting = noteBackgroundSetting.createEl("div")

		const dynamicEffectLabel = dynamicEffectSetting.createEl("div")
		dynamicEffectLabel.addClass("setting-item-label")
		dynamicEffectLabel.textContent = "Dynamic effect"

		const dynamicEffectDropdown = new DropdownComponent(dynamicEffectSetting)
		dynamicEffectDropdown
			.addOptions(defaultDynamicEffects)

		// bg blend
		const bgBlendSetting = noteBackgroundSetting.createEl("div")

		const bgBlendLabel = bgBlendSetting.createEl("div")
		bgBlendLabel.addClass("setting-item-label")
		bgBlendLabel.textContent = "Background blend"

		const bgBlendDropdown = new DropdownComponent(bgBlendSetting)
		bgBlendDropdown
			.addOptions(bgBlendingModeOptions)

		// bg path
		const backgroundPathSetting = noteBackgroundSetting.createEl("div")
		backgroundPathSetting.addClass("background-path-setting")

		const backgroundPathLabel = backgroundPathSetting.createEl("div")
		backgroundPathLabel.addClass("setting-item-label")
		backgroundPathLabel.textContent = "Background path"
		
		const backgroundPathSettingInput = backgroundPathSetting.createEl("input")
		backgroundPathSettingInput.addClass("setting-item-input")
		backgroundPathSettingInput.placeholder = "Path to background (Eg. image.png)"
		backgroundPathSettingInput.type = "text"
		backgroundPathSettingInput.value = ""

		// bg color hex
		const backgroundColorSetting = noteBackgroundSetting.createEl("div")

		const backgroundColorLabel = backgroundColorSetting.createEl("div")
		backgroundColorLabel.addClass("setting-item-label")
		backgroundColorLabel.textContent = "Background Color"
		
		const backgroundColorInput = new TextComponent(backgroundColorSetting);
		backgroundColorInput.inputEl.addClass("color-setting-value");
		backgroundColorInput
		.setPlaceholder("Color hex code")
		.setValue(this.plugin.settings.backgroundColor)
		.onChange((text) => {
			backgroundColorInput.inputEl.setAttribute("value", text)
			backgroundColorInput.inputEl.setAttribute("style", `background-color: ${text}; color: var(--text-normal);`)
		})
		.then((input) =>{
			backgroundColorInput.inputEl.setAttribute("value",this.plugin.settings.backgroundColor)
			backgroundColorInput.inputEl.setAttribute("style", `background-color: ${this.plugin.settings.backgroundColor}; color: var(--text-normal);`)
		})

		// bg color picker
		const backgroundColorPickerSetting = noteBackgroundSetting.createEl("div")
		backgroundColorPickerSetting.addClass("color-picker-item")

		const backgroundColorPickerLabel = backgroundColorPickerSetting.createEl("div")
		backgroundColorPickerLabel.addClass("setting-item-label")
		backgroundColorPickerLabel.textContent = "Color Picker"
		
		const backgroundColorPicker = new ButtonComponent(backgroundColorPickerSetting)
		backgroundColorPicker
			.setClass("color-picker")
			.then(() => {
				let input = backgroundColorInput.inputEl
				let currentColor = backgroundColorInput.inputEl.value || null
				let colorMap = this.plugin.settings.colorMap

				let colorHex;
				let pickrCreate = new Pickr({
					el: ".color-picker",
					theme: "nano",
					swatches: colorMap,
					defaultRepresentation: "HEXA",
					default: colorMap[colorMap.length - 1],
					comparison: false,
					components: {
						preview: true,
						opacity: true,
						hue: true,
						interaction: {
						hex: true,
						rgba: true,
						hsla: false,
						hsva: false,
						cmyk: false,
						input: true,
						clear: true,
						cancel: true,
						save: true,
						},
					},
				})
				pickrCreate
				.on("clear", function (instance: Pickr) {
					instance.hide()
					input.trigger("change")
				})
				.on("cancel", function (instance: Pickr) {
					currentColor = instance.getSelectedColor().toHEXA().toString();

					input.trigger("change");
					instance.hide();
				})
				.on("change", function (color: Pickr.HSVaColor) {
					colorHex = color.toHEXA().toString();
					let newColor;
					colorHex.length == 6
					? (newColor = `${color.toHEXA().toString()}A6`)
					: (newColor = color.toHEXA().toString());

					input.setAttribute("value", newColor)
					input.setAttribute("style", `background-color: ${newColor}; color: var(--text-normal);`)

					input.setText(newColor);
					input.textContent = newColor;
					input.value = newColor;
					input.trigger("change");
				})
				.on("save", function (color: Pickr.HSVaColor, instance: Pickr) {
					let newColorValue = color.toHEXA().toString();

					input.setText(newColorValue);
					input.textContent = newColorValue;
					input.value = newColorValue;
					input.trigger("change");

					instance.hide();
					instance.addSwatch(color.toHEXA().toString());
				});
		})

		// blur slider
		const backgroundBlurSetting = noteBackgroundSetting.createEl("div")
		backgroundBlurSetting.addClass("slider-blur-setting")

		const backgroundBlurTextContainer = backgroundBlurSetting.createEl("div")
		const backgroundBlurSliderContainer = backgroundBlurSetting.createEl("div")
		backgroundBlurSliderContainer.addClass("slider-item-container")

		const backgroundBlurLabel = backgroundBlurTextContainer.createEl("div")
		backgroundBlurLabel.addClass("setting-item-label")
		backgroundBlurLabel.textContent = "Blur"

		const backgroundBlurText = new TextComponent(backgroundBlurTextContainer)
		const backgroundBlurSlider = new SliderComponent(backgroundBlurSliderContainer)
		backgroundBlurText
			.inputEl.addClass("slider-text")
		backgroundBlurText
			.setValue("0")
			.setPlaceholder("0")
			.onChange(async value => {
				if(Number(value) > 100) value = "100"
				if(Number(value) < 0 || value == "") value = "0"
				backgroundBlurText.setValue(value)
				backgroundBlurSlider.setValue(Number(value))
			});
		backgroundBlurSlider
			.setDynamicTooltip()
			.setLimits(0, 100, 1)
			.setValue(0)
			.onChange(async value => {
				backgroundBlurText.setValue(value.toString())
			});

		// brightness slider
		const backgroundBrightnessSetting = noteBackgroundSetting.createEl("div")
		backgroundBrightnessSetting.addClass("slider-brightness-setting")

		const backgroundBrightnessTextContainer = backgroundBrightnessSetting.createEl("div")
		const backgroundBrightnessSliderContainer = backgroundBrightnessSetting.createEl("div")
		backgroundBrightnessSliderContainer.addClass("slider-item-container")

		const backgroundBrightnessLabel = backgroundBrightnessTextContainer.createEl("div")
		backgroundBrightnessLabel.addClass("setting-slider-label")
		backgroundBrightnessLabel.textContent = "Brightness"

		const backgroundBrightnessText = new TextComponent(backgroundBrightnessTextContainer)
		const backgroundBrightnessSlider = new SliderComponent(backgroundBrightnessSliderContainer)
		backgroundBrightnessText
			.inputEl.addClass("slider-text")
		backgroundBrightnessText
			.setValue("0")
			.setPlaceholder("0")
			.onChange(async value => {
				if(Number(value) > 200) value = "100"
				if(Number(value) < 0 || value == "") value = "0"
				backgroundBrightnessText.setValue(value)
				backgroundBrightnessSlider.setValue(Number(value))
			});
		backgroundBrightnessSlider
			.setDynamicTooltip()
			.setLimits(0, 200, 1)
			.setValue(0)
			.onChange(async value => {
				backgroundBrightnessText.setValue(value.toString())
			});

		// Buttons
		const buttonsContainer = noteBackgroundSetting.createEl("div")
		buttonsContainer.addClass("buttons-container")

		// undo button
		const undoButton = new ButtonComponent(buttonsContainer)
		addIcon("reset-icon", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" style="--darkreader-inline-stroke: currentColor;" data-darkreader-inline-stroke=""> <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path> <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path> <path d="M12 9l0 3"></path> <path d="M12 15l.01 0"></path> </svg> `)
		undoButton
			.setClass("undo-button")
			.setClass("setting-button")
			.setIcon("reset-icon")
			.setTooltip("Reset")
			.onClick(async (button) => {
				notePathSettingInput.value = ""
				dynamicEffectDropdown.setValue(this.plugin.settings.dynamicEffect.toString())
				backgroundPathSettingInput.value = ""
				bgBlendDropdown.setValue(this.plugin.settings.backgroundBlendMode)

				backgroundColorInput.setValue(this.plugin.settings.backgroundColor)
				backgroundColorInput.inputEl.setAttribute("value", this.plugin.settings.backgroundColor)
				backgroundColorInput.inputEl.setAttribute("style", `background-color: ${this.plugin.settings.backgroundColor}; color: var(--text-normal);`)

				backgroundBrightnessSlider.setValue(0)
				backgroundBrightnessText.setValue("0")

				backgroundBlurSlider.setValue(0)
				backgroundBlurText.setValue("0")
			})

		// save button
		const saveButton = new ButtonComponent(buttonsContainer)
		const date = new Date()
		saveButton
			.setClass("save-button")
			.setClass("setting-button")
			.setIcon("save-icon")
			.setTooltip("Save")
			.onClick(async (button) => {
				let notePath = notePathSettingInput.value
				if (notePath) {
					this.plugin.settings.notesBackgroundMap.push({
						"index": date.getTime(),
						"notePath": notePath,
						"dynamicEffect": dynamicEffectDropdown.getValue(),
						"backgroundPath": backgroundPathSettingInput.value,
						"backgroundBlend": bgBlendDropdown.getValue(),
						"backgroundColor": backgroundColorInput.getValue(),
						"backgroundBrightness": backgroundBrightnessSlider.getValue(),
						"backgroundBlur": backgroundBlurSlider.getValue()
					})
					new Notice("Note background saved successfully")
					await this.plugin.saveSettings()
					this.plugin.saveData(this.plugin.settings)
					this.display()
				} else if(!notePath) {
					new Notice("No note path has been added")
				}
			})


		const noteBackgroundListInfo = new Setting(containerEl)

		noteBackgroundListInfo
			.setName('Note dynamic effects list')
			.setDesc('View or change saved dynamic effects and backgrounds for notes')
			.setClass("note-background-settings")
		
		const pathsContainer = containerEl.createEl("div", {
			cls: "paths-container"
		})

		Sortable.create(pathsContainer, {
			animation: 500,
			ghostClass: "container-sortable-ghost",
			chosenClass: "container-sortable-chosen",
			dragClass: "container-sortable-drag",
			draggable: ".draggable",
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

		
		this.plugin.settings.notesBackgroundMap.forEach((note) => {
			
			const settingItem = pathsContainer.createEl("div");
			settingItem.addClass("container-item-draggable");

			// Icon
			const settingIcon = settingItem.createEl("div");
			settingIcon.addClass("setting-item-icon");
	
			const vaultPath = (this.app.vault.adapter as any).basePath

			if(fs.existsSync(vaultPath + "/" + note.notePath) && fs.lstatSync(vaultPath + "/" + note.notePath).isDirectory()) {
				// Folder
				settingIcon.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-folder"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" /></svg>` 
			} else if (fs.existsSync(vaultPath + "/" + note.notePath) && fs.lstatSync(vaultPath + "/" + note.notePath).isFile()) {
				// File
				settingIcon.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-file"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></svg>`	
			} else {
				//Not found
				settingIcon.innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" /></svg>`
			}
			


			// Note path
			const notePathSetting = settingItem.createEl("div")
			notePathSetting.addClass("note-path-setting")

			const notePathLabel = notePathSetting.createEl("div")
			notePathLabel.addClass("setting-item-label")
			notePathLabel.textContent = "Note path"
			
			const notePathSettingInput = notePathSetting.createEl("input")
			notePathSettingInput.addClass("setting-item-input")
			notePathSettingInput.placeholder = "Path to note"
			notePathSettingInput.type = "text"
			notePathSettingInput.value = note.notePath
			
			// dyn effect
			const dynamicEffectSetting = settingItem.createEl("div")

			const dynamicEffectLabel = dynamicEffectSetting.createEl("div")
			dynamicEffectLabel.addClass("setting-item-label")
			dynamicEffectLabel.textContent = "Dynamic effect"

			const dynamicEffectDropdown = new DropdownComponent(dynamicEffectSetting)
			dynamicEffectDropdown
				.addOptions(defaultDynamicEffects)
				//.addOptions(userAddedDynamicBackgrounds)	
				.setValue(note.dynamicEffect)

			// bg blend
			const bgBlendSetting = settingItem.createEl("div")

			const bgBlendLabel = bgBlendSetting.createEl("div")
			bgBlendLabel.addClass("setting-item-label")
			bgBlendLabel.textContent = "Background blend"

			const bgBlendDropdown = new DropdownComponent(bgBlendSetting)
			bgBlendDropdown
				.addOptions(bgBlendingModeOptions)
				//.addOptions(userAddedDynamicBackgrounds)	
				.setValue(note.backgroundBlend)

			// bg path
			const backgroundPathSetting = settingItem.createEl("div")
			backgroundPathSetting.addClass("background-path-setting")

			const backgroundPathLabel = backgroundPathSetting.createEl("div")
			backgroundPathLabel.addClass("setting-item-label")
			backgroundPathLabel.textContent = "Background path"
			
			const backgroundPathSettingInput = backgroundPathSetting.createEl("input")
			backgroundPathSettingInput.addClass("setting-item-input")
			backgroundPathSettingInput.placeholder = "Path to background"
			backgroundPathSettingInput.type = "text"
			backgroundPathSettingInput.value = note.backgroundPath

			// bg color hex
			const backgroundColorSetting = settingItem.createEl("div")

			const backgroundColorLabel = backgroundColorSetting.createEl("div")
			backgroundColorLabel.addClass("setting-item-label")
			backgroundColorLabel.textContent = "Background Color"
			
			const backgroundColorInput = new TextComponent(backgroundColorSetting);
			backgroundColorInput.inputEl.addClass("color-setting-value");
			backgroundColorInput
			.setPlaceholder("Color hex code")
			.setValue(note.backgroundColor)
			.onChange((text) => {
				backgroundColorInput.inputEl.setAttribute("value", text)
				backgroundColorInput.inputEl.setAttribute("style", `background-color: ${text}; color: var(--text-normal);`)
			})
			.then((input) =>{
				backgroundColorInput.inputEl.setAttribute("value", note.backgroundColor)
				backgroundColorInput.inputEl.setAttribute("style", `background-color: ${note.backgroundColor}; color: var(--text-normal);`)
			})

			// bg color picker
			const backgroundColorPickerSetting = settingItem.createEl("div")
			backgroundColorPickerSetting.addClass("color-picker-item")

			const backgroundColorPickerLabel = backgroundColorPickerSetting.createEl("div")
			backgroundColorPickerLabel.addClass("setting-item-label")
			backgroundColorPickerLabel.textContent = "Color Picker"
			
			const backgroundColorPicker = new ButtonComponent(backgroundColorPickerSetting)
			backgroundColorPicker
				.setClass("color-picker")
				.then(() => {
					let input = backgroundColorInput.inputEl
					let currentColor = backgroundColorInput.inputEl.value || null
					let colorMap = this.plugin.settings.colorMap

					let colorHex;
					let pickrCreate = new Pickr({
						el: ".color-picker",
						theme: "nano",
						swatches: colorMap,
						defaultRepresentation: "HEXA",
						default: colorMap[colorMap.length - 1],
						comparison: false,
						components: {
							preview: true,
							opacity: true,
							hue: true,
							interaction: {
							hex: true,
							rgba: true,
							hsla: false,
							hsva: false,
							cmyk: false,
							input: true,
							clear: true,
							cancel: true,
							save: true,
							},
						},
					})
					pickrCreate
					.on("clear", function (instance: Pickr) {
						instance.hide()
						input.trigger("change")
					})
					.on("cancel", function (instance: Pickr) {
						currentColor = instance.getSelectedColor().toHEXA().toString();

						input.trigger("change");
						instance.hide();
					})
					.on("change", function (color: Pickr.HSVaColor) {
						colorHex = color.toHEXA().toString();
						let newColor;
						colorHex.length == 6
						? (newColor = `${color.toHEXA().toString()}A6`)
						: (newColor = color.toHEXA().toString());

						input.setAttribute("value", newColor)
						input.setAttribute("style", `background-color: ${newColor}; color: var(--text-normal);`)

						input.setText(newColor);
						input.textContent = newColor;
						input.value = newColor;
						input.trigger("change");
					})
					.on("save", function (color: Pickr.HSVaColor, instance: Pickr) {
						let newColorValue = color.toHEXA().toString();

						input.setText(newColorValue);
						input.textContent = newColorValue;
						input.value = newColorValue;
						input.trigger("change");

						instance.hide();
						instance.addSwatch(color.toHEXA().toString());
					});
			})

			// blur slider
			const backgroundBlurSetting = settingItem.createEl("div")
			backgroundBlurSetting.addClass("slider-blur-setting")

			const backgroundBlurTextContainer = backgroundBlurSetting.createEl("div")
			const backgroundBlurSliderContainer = backgroundBlurSetting.createEl("div")
			backgroundBlurSliderContainer.addClass("slider-item-container")

			const backgroundBlurLabel = backgroundBlurTextContainer.createEl("div")
			backgroundBlurLabel.addClass("setting-item-label")
			backgroundBlurLabel.textContent = "Blur"

			const backgroundBlurText = new TextComponent(backgroundBlurTextContainer)
			const backgroundBlurSlider = new SliderComponent(backgroundBlurSliderContainer)
			backgroundBlurText
				.inputEl.addClass("slider-text")
			backgroundBlurText
				.setValue(note.backgroundBlur.toString())
				.setPlaceholder("0")
				.onChange(async value => {
					if(Number(value) > 100) value = "100"
					if(Number(value) < 0) value = "0"
					backgroundBlurText.setValue(value)
					backgroundBlurSlider.setValue(Number(value))
				});
			backgroundBlurSlider
				.setDynamicTooltip()
				.setLimits(0, 100, 1)
				.setValue(note.backgroundBlur)
				.onChange(async value => {
					backgroundBlurText.setValue(value.toString())
				});

			// brightness slider
			const backgroundBrightnessSetting = settingItem.createEl("div")
			backgroundBrightnessSetting.addClass("slider-brightness-setting")

			const backgroundBrightnessTextContainer = backgroundBrightnessSetting.createEl("div")
			const backgroundBrightnessSliderContainer = backgroundBrightnessSetting.createEl("div")
			backgroundBrightnessSliderContainer.addClass("slider-item-container")

			const backgroundBrightnessLabel = backgroundBrightnessTextContainer.createEl("div")
			backgroundBrightnessLabel.addClass("setting-slider-label")
			backgroundBrightnessLabel.textContent = "Brightness"

			const backgroundBrightnessText = new TextComponent(backgroundBrightnessTextContainer)
			const backgroundBrightnessSlider = new SliderComponent(backgroundBrightnessSliderContainer)
			backgroundBrightnessText
				.inputEl.addClass("slider-text")
			backgroundBrightnessText
				.setValue(note.backgroundBrightness.toString())
				.setPlaceholder("0")
				.onChange(async value => {
					if(Number(value) > 200) value = "100"
					if(Number(value) < 0) value = "0"
					backgroundBrightnessText.setValue(value)
					backgroundBrightnessSlider.setValue(Number(value))
				});
			backgroundBrightnessSlider
				.setDynamicTooltip()
				.setLimits(0, 200, 1)
				.setValue(note.backgroundBrightness)
				.onChange(async value => {
					backgroundBrightnessText.setValue(value.toString())
				});
			
			// Buttons
			const buttonsContainer = settingItem.createEl("div")
			buttonsContainer.addClass("buttons-container")

			
			// undo button
			const undoButton = new ButtonComponent(buttonsContainer)
			undoButton
				.setClass("undo-button")
				.setClass("setting-button")
				.setIcon("undo-icon")
				.setTooltip("Undo changes")
				.onClick(async (button) => {
					notePathSettingInput.value = note.notePath
					dynamicEffectDropdown.setValue(note.dynamicEffect)
					backgroundPathSettingInput.value = note.backgroundPath
					bgBlendDropdown.setValue(note.backgroundBlend)

					backgroundColorInput.setValue(note.backgroundColor)
					backgroundColorInput.inputEl.setAttribute("value", note.backgroundColor)
					backgroundColorInput.inputEl.setAttribute("style", `background-color: ${note.backgroundColor}; color: var(--text-normal);`)

					backgroundBrightnessSlider.setValue(note.backgroundBrightness)
					backgroundBrightnessText.setValue(note.backgroundBrightness.toString())

					backgroundBlurSlider.setValue(note.backgroundBlur)
					backgroundBlurText.setValue(note.backgroundBlur.toString())
				})

			// save button
			const saveButton = new ButtonComponent(buttonsContainer)

			saveButton
				.setClass("save-button")
				.setClass("setting-button")
				.setIcon("save-icon")
				.setTooltip("Save changes")
				.onClick(async (button) => {
					let notePath = notePathSettingInput.value
					if (notePath) {
						const modifyIndex:number = this.plugin.settings.notesBackgroundMap.findIndex(notes => notes.index == note.index) 
						console.log(this.plugin.settings.notesBackgroundMap[modifyIndex])
						this.plugin.settings.notesBackgroundMap[modifyIndex] =
						{
							"index": note.index,
							"notePath": notePathSettingInput.value,
							"dynamicEffect": dynamicEffectDropdown.getValue(),
							"backgroundPath": backgroundPathSettingInput.value,
							"backgroundBlend": bgBlendDropdown.getValue(),
							"backgroundColor": backgroundColorInput.getValue(),
							"backgroundBrightness": backgroundBrightnessSlider.getValue(),
							"backgroundBlur": backgroundBlurSlider.getValue()
						}
						new Notice("Note background updated successfully")
						await this.plugin.saveSettings()
						this.plugin.saveData(this.plugin.settings)
						this.display()
					} else if(!notePath) {
						new Notice("No note path has been added")
					}
				})


			addIcon("delete-icon",`<svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.5"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>`)

			const deleteButton = new ButtonComponent(buttonsContainer)
			deleteButton
				.setClass("delete-button")
				.setClass("setting-button")
				.setIcon("delete-icon")
				.setTooltip("Remove")
				.onClick(async () => {
					const confirmModal = new Modal(this.app)
					confirmModal.setTitle("Delete note path")
					new Setting(confirmModal.contentEl)
						.setName(`Background settings for the note in path: "` + note.notePath + `"will be deleted`)
						.addButton((button) => {button
							.setTooltip("Delete")
							.setButtonText("Delete")
							.setClass("delete-button")
							.onClick(async (button) => {
								this.plugin.settings.notesBackgroundMap.remove(note);
								await this.plugin.saveSettings();
								this.display();
								confirmModal.close()
							})
						})
						.addButton(button => { button
							.setTooltip("Cancel")
							.setButtonText("Cancel")
							.onClick((button) => {
								confirmModal.close()
							})
						})
					confirmModal.open()


				}); 

		});
	}
}
