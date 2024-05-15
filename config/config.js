const argvs = process.argv;
let application, env;
if(argvs.length === 1){
  let argArr = argvs[0].split('\\');
  argArr = argArr[argArr.length - 1].replace('AppName', '').replace('.exe', '').toLowerCase();
  argArr = argArr.split('-');
  application = argArr[0];
  env = argArr[1] || 'prod';
}else{
  env = process.env.NODE_ENV;
}
console.log("argvs env", env);

let eventArr = String(process.env.npm_lifecycle_event).split('-');
application = eventArr[1] || application || 'domesticApp';
let version = '0.2.9'; // your App Version, must different with the online version
console.log("application", application);

const appArr = [
  { name: 'domesticApp', author: 'Domestic', id: 1 },
  { name: 'globalApp', author: 'Global', id: 2 }
];

class buildConf {
  constructor (opts, env) {
    Object.assign(this, {
      //executableName: opts.name,
      buildVersion: version,
      productName: `${opts.author+(env !== 'prod' ? '-'+env:'')}AppName`,
      appId: `com.${opts.author}Desktop.${env}.app`,
      electronVersion: "30.0.3",
      copyright: `${opts.author}@2024`,
      artifactName: `${opts.author}Desktop.${(env !== 'prod' ? env+'.':'')+version}.exe`,
      asar: true,
      directories: {
        output: `dist/${env}/${version}/${opts.author}Desktop/`
      },
      extraResources:[ 'preload.js' ], // Extend resources
      extraFiles: [ 'static', 'preload.js' ], // Extension Files
      files: [ 'main.js', 'utils', 'config', 'static' ], // Folders to be packed
      extends: null,
      win: {
        icon: `./logo/${opts.name}.ico`,
        requestedExecutionLevel: 'highestAvailable',
        target: [{
          target: 'nsis',
          arch: [ 'x64', /**'ia32'**/ ]
        }],
        asarUnpack: [ '~temp', 'README.md', 'preload.js', 'obs-log' ] // Unpackaged files
      },
      nsis: {
        oneClick: false,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
        installerIcon: `./logo/${opts.name}.ico`,
        uninstallerIcon: `./logo/${opts.name}.ico`,
        installerHeaderIcon: `./logo/${opts.name}.ico`,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: `${opts.author+(env !== 'prod' ? '-'+env:'')}AppName`,
        include: ''
      },
      publish: [{
        provider: 'generic',
        url: `http://${env}.myapp.com/update/` // same as the checkerUpdate.js autoUpdater.url
      }],
      releaseInfo: {
        // releaseName: executableName,
        // releaseNotes: opts.author,
        // releaseNotesFile: `this is url`,
        vendor: {
          id: opts.id,
          name: opts.name,
          author: opts.author,
          version,
          dev: `http://localhost:1515/#/login?logoId=${opts.id}`, // your dev mode localhost url
          test: `http://${env}.myapp.com`, // your test mode website url
          prod: `http://${env}.myapp.com`, // your prod mode website url
        }
      },
      defaultArch: env
    });
  }
}
const getAppConf = () => {
  let obj = appArr[0];
  for(let i=0;i<appArr.length;i++){
    if(application === appArr[i].name){
      obj = appArr[i];
    }
  }
  return new buildConf(obj, env);
}

module.exports = getAppConf();
