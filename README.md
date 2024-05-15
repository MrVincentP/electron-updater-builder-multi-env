# electron-updater-builder-multi-env
an electron demo with electron-builder and electron-updater, it depends on Self-developed multi-environment configuration.

# Dependencies 
Today is May 15, 2024. These dependency packages are all the latest so far. Please upgrade as appropriate.

    "electron": "^30.0.3",
    "electron-builder": "^24.13.3",
    "@electron/remote": "^2.1.2",
    "cross-env": "^7.0.3",
    "electron-updater": "^6.1.8"

# Notice
If you are a user in China, please keep the npmrc file. If not, please delete the npmrc file.

# Requirement

In the electron environment, if we need to use automatic updates, we can use the electron-updater component. If we need to package applications, we need to use the electron-builder component. Of course, these are basic needs.

So here comes the question, if we need to package an electron application into different ico icons and names, what should we do?

This component was developed to solve these problems. I hope it will be useful to everyone.

# Principle
Obtain the packaged name by intercepting the node command, and then obtain the packaged config through the configuration file.

# Example

Your app running instructions should look like the following

        "start": "chcp 65001 && cross-env NODE_ENV=dev electron . --trace-deprecation --win --config config/config.js",
        "build-domesticApp-test": "cross-env NODE_ENV=test electron-builder --win --config config/config.js",
        "build-domesticApp-prod": "cross-env NODE_ENV=prod electron-builder --win --config config/config.js",
        "build-globalApp-test": "cross-env NODE_ENV=test electron-builder --win --config config/config.js",
        "build-globalApp-prod": "cross-env NODE_ENV=prod electron-builder --win --config config/config.js",


