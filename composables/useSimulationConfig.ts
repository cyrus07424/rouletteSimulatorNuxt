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
  selectedStrategies: ['martingale'],
};

// Global state shared across all instances
const globalConfig = ref<SimulationConfig>({ ...defaultConfig });

export const useSimulationConfig = () => {
  const setConfig = (newConfig: SimulationConfig) => {
    globalConfig.value = { ...newConfig };
  };

  const getConfig = (): SimulationConfig => {
    return { ...globalConfig.value };
  };

  const resetConfig = () => {
    globalConfig.value = { ...defaultConfig };
  };

  return {
    config: readonly(globalConfig),
    setConfig,
    getConfig,
    resetConfig,
  };
};