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

export const useSimulationConfig = () => {
  const config = ref<SimulationConfig>(defaultConfig);

  const setConfig = (newConfig: SimulationConfig) => {
    config.value = { ...newConfig };
  };

  const getConfig = (): SimulationConfig => {
    return { ...config.value };
  };

  const resetConfig = () => {
    config.value = { ...defaultConfig };
  };

  return {
    config: readonly(config),
    setConfig,
    getConfig,
    resetConfig,
  };
};