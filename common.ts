export enum DynamicEffectEnum {
	Dark_StarSky = 1,
	Dark_Snow = 2,
	Dark_Rain = 3,
	Dark_RandomCircle = 4,
	Dark_DigitalRain = 5,

	Light_RandomCircle = 40,
	Light_Wave = 41,
	
	Unknown = -1,
	None = -1
}

export interface DynamicBackgroundPluginSettings {
	dynamicEffect: DynamicEffectEnum;
	digitalRainBrightness: number;
	enableDynamicEffect: boolean;
	backgroundImageFile: string;
	blur:number;
	notesBackgroundMap: {notePath: string, dynamicEffect: string, backgroundPath: string}[]
	brightness: number;
	backgroundColor: string;
	backgroundBlendMode: string
}
