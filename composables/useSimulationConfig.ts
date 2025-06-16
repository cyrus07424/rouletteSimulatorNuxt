import {RouletteType, SpotGenerateType} from '~/types';

export interface SimulationConfig {
  rouletteType: RouletteType;
  spotGenerateType: SpotGenerateType;
  initialBalance: number;
  minBetAmount: number;
  maxBetAmount: number;
  simulationSpeed: number;
  selectedStrategies: string[];
}

const defaultConfig: SimulationConfig = {
  rouletteType: RouletteType.EUROPEAN_STYLE,
  spotGenerateType: SpotGenerateType.RANDOM,
  initialBalance: 1000,
  minBetAmount: 1,
  maxBetAmount: 100,
  simulationSpeed: 100,
  selectedStrategies: ['martingale', 'fixed', 'cocomo'], // All strategies selected by default
};

// Global state shared across all instances
const globalConfig = ref<SimulationConfig>({ ...defaultConfig });

// Load config from localStorage on initialization
const loadConfigFromStorage = (): SimulationConfig => {
  if (process.client) {
    try {
      const stored = localStorage.getItem('rouletteSimulatorConfig');
      if (stored) {
        return { ...defaultConfig, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load config from localStorage:', e);
    }
  }
  return { ...defaultConfig };
};

// Save config to localStorage
const saveConfigToStorage = (config: SimulationConfig) => {
  if (process.client) {
    try {
      localStorage.setItem('rouletteSimulatorConfig', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save config to localStorage:', e);
    }
  }
};

// Initialize with loaded config
globalConfig.value = loadConfigFromStorage();

export const useSimulationConfig = () => {
  const setConfig = (newConfig: SimulationConfig) => {
    globalConfig.value = { ...newConfig };
    saveConfigToStorage(globalConfig.value);
  };

  const getConfig = (): SimulationConfig => {
    return { ...globalConfig.value };
  };

  const resetConfig = () => {
    globalConfig.value = { ...defaultConfig };
    saveConfigToStorage(globalConfig.value);
  };

  return {
    config: readonly(globalConfig),
    setConfig,
    getConfig,
    resetConfig,
  };
};