const {app,BrowserWindow,ipcMain,dialog}=require('electron')
const path=require('path')

app.whenReady().then(()=>{
    ipcMain.handle('openFile',handleFileOpen)

    const win=new BrowserWindow({
        width:1000,
        height:750,
        webPreferences:{
          preload:path.join(__dirname,'preload.js')
        }
    })
    win.removeMenu()
    win.loadFile('index.html')
})
app.on('window-all-closed',()=>{
    app.quit()
})

async function handleFileOpen(){
    const {canceled,filePaths}=await dialog.showOpenDialog({filters:[{name:"Executable",extensions:["exe"]}]})
    if(canceled){}else{
      return filePaths[0];
    }
  }