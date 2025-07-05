const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable Hermes for better performance
config.transformer.hermesCommand = 'hermes';

module.exports = config;