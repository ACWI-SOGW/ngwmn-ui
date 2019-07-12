import waterLevels from './water-levels'; 
import medianWaterLevels from './median-water-levels'; 
import wellLog from './well-log';

export * from './water-levels';
export * from './median-water-levels';
export * from './well-log';
export default {
    ...waterLevels,
    ...medianWaterLevels,
    ...wellLog
};
