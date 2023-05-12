const {app,BrowserWindow}=require('electron')
const path=require('path')

app.whenReady().then(()=>{
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
