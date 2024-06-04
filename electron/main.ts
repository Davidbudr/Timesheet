import { app, BrowserWindow, Menu, MenuItemConstructorOptions, screen, Tray } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray;

let hideOnBlur: boolean = true;
const size = {height: 800, width: 532,resizable: false};
const TRAY_TEMPLATE:MenuItemConstructorOptions[] = [
  {
    label: 'hide on blur',
    type: 'checkbox',
    checked: hideOnBlur,
    click: () =>{hideOnBlur = !hideOnBlur}
    
  },
  {
  label: "close",
  click: ()=> app!.quit()
}];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'timesheet.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    show: false,
    frame: false,
    skipTaskbar: true,
    ...size
  })
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
  tray = new Tray(path.join(process.env.VITE_PUBLIC, 'timesheet_Icon.png'));
  const trayMenu = Menu.buildFromTemplate(TRAY_TEMPLATE);
  tray.setContextMenu(trayMenu);
  tray.on('click', ()=>{
    if (win?.isVisible()) {
      win?.hide();
    }
    else{
      const displays = screen.getAllDisplays();
      const maindisplay = displays.find(display => display.bounds.x === 0 && display.bounds.y === 0);
  
      const {y,height:trayheight} = tray.getBounds();;
      const {width} = win!.getBounds();
      const {height, width:screenwidth} = maindisplay!.bounds;
      const winBounds = { x: screenwidth - width, y: y -(height- trayheight), width,height: height- trayheight };
      win?.setBounds(winBounds);
      win?.show();
    }
  })


  let blurTimer: NodeJS.Timeout;
  win.on('blur',()=>{
    if (hideOnBlur){
      if (blurTimer){
        clearTimeout(blurTimer);
      }
      blurTimer = setTimeout(()=>{
        if (win?.isVisible()){
          win?.hide();
        }
      },215);
    }
  })

}

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
}
else{
  app.on('second-instance', () =>{
    win?.show();
    win?.focus();
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
      win = null
    }
  })
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  
  app.whenReady().then(createWindow)
}
