import foundation from '../../../tokens/foundation.tokens.json';
export const customBackgroundDefaults=Object.values(foundation.primitive.accent).map(accent=>accent.start.$value.hex.toUpperCase());
