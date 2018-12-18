import construction from './construction';
import lithology from './lithology';

export * from './construction';
export * from './lithology';

export default {
    ...construction,
    ...lithology
};

