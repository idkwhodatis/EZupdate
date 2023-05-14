const {app,BrowserWindow,ipcMain,dialog}=require("electron")
const path=require("path")
const vi=require("win-version-info")
const fs=require("fs")

app.whenReady().then(()=>{
    ipcMain.handle("openFile",openFile);
    ipcMain.handle("fileVer",fileVer);
    ipcMain.handle("saveConfig",saveConfig);
    ipcMain.handle("readConfig",readConfig);

    const win=new BrowserWindow({
        width:1000,
        height:750,
        webPreferences:{
          preload:path.join(__dirname,"preload.js")
        }
    })
    win.removeMenu()
    win.loadFile("index.html")
    win.webContents.openDevTools()

})
app.on("window-all-closed",()=>{
    app.quit()
})

async function openFile(){
    const {canceled,filePaths}=await dialog.showOpenDialog({filters:[{name:"Executable",extensions:["exe"]}]})
    if(canceled){}else{
        return filePaths[0];
    }
}

async function fileVer(event,dir){
    return vi(dir).FileVersion;
}

async function saveConfig(event,config){
    fs.writeFile(path.join(__dirname,"config.json"),config,"utf8",function(err){
        if(err){return}
    })
}

async function readConfig(){
    fs.readFile(path.join(__dirname,"config.json"),"utf8",function(err,data){
        if(err){return}
        return data;
    })
}