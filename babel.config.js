module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          api: './src/api',
          assets: './src/assets',
          components: './src/components',
          config: './src/config',
          context: './src/context',
          hooks: './src/hooks',
          navigation: './src/navigation',
          screens: './src/screens',
          pl: './src/screens/Pl',
          TwoWheeler: './src/screens/TwoWheeler',
          Authentication: './src/screens/Authentication',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: [
        'transform-remove-console',
        // Add other plugins you need in production here
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              api: './src/api',
              assets: './src/assets',
              components: './src/components',
              config: './src/config',
              context: './src/context',
              hooks: './src/hooks',
              navigation: './src/navigation',
              screens: './src/screens',
              pl: './src/screens/Pl',
              TwoWheeler: './src/screens/TwoWheeler',
              Authentication: './src/screens/Authentication',
            },
          },
        ],
        'react-native-reanimated/plugin',
      ],
    },
  },
};