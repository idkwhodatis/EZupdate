const {app,BrowserWindow,ipcMain,dialog}=require("electron")
const path=require("path")
const vi=require("win-version-info")
const fs=require("fs")
const fetch=require("node-fetch")
const unzip=require("adm-zip")
const unrar=require("unrar")
const un7z=require("7zip-min")
const untar=require("tar")

app.whenReady().then(()=>{
    ipcMain.handle("openFile",openFile);
    ipcMain.handle("fileVer",fileVer);
    ipcMain.on("saveConfig",saveConfig);
    ipcMain.handle("loadConfig",loadConfig);
    ipcMain.on("update",update);

    const win=new BrowserWindow({
        width:1000,
        height:750,
        webPreferences:{
          preload:path.join(__dirname,"preload.js")
        }
    })
    win.removeMenu();
    win.loadFile("index.html");
    win.webContents.openDevTools();

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

function fileVer(event,dir){
    try{
        const ver=vi(dir).FileVersion;
        return ver;
    }catch(e){return "";}
}

function saveConfig(event,config){
    fs.writeFile(path.join(__dirname,"config.json"),config,"utf8",function(err){
        if(err){return}
    })
}

async function loadConfig(){
    return new Promise((resolve,reject)=>{
        fs.readFile(path.join(__dirname,"config.json"),"utf-8",(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });
}

async function update(event,url,output,compressed){
    fileDir=path.join(output,path.basename(url));
    fetch(url)
        .then(res=>{
            const file=fs.createWriteStream(fileDir);
            res.body.pipe(file);
            res.body.on("error",(err)=>{
                console.log(`Error while downloading the file. ${err}`);
            });
            fileStream.on("finish",function(){
                console.log('Successfully downloaded file!');
            });
        })
    switch(compressed){
        case "zip":
            const zip=new unzip(fileDir);
            zip.extractAllTo(output,true);
            break;
        case "rar":
            const rar=new unrar(fileDir);
            rar.extract(path.join(output,"\\uncompressed"),null,function(err){
                if(err){console.error(err)}
                else{console.log('Successfully extracted')}
            });
            move(output);
            break;
        case "7z":
            un7z.unpack(fileDir,path.join(output,"\\uncompressed"),function(err){
                if(err){console.error(err)}
                else{console.log('Successfully extracted')}
            });
            move(output);
            break;
        case "tar":
            tar.x({
                file:fileDir,
                C:output,
                overwrite:true
            });
    }
}

function move(output){
    fs.readdir(path.join(output,"\\uncompressed"),function(err,files){
        if(err){throw err}
      
        files.forEach(function(file){
          const sourcePath=path.join(path.join(output,"\\uncompressed"),file);
          const destinationPath=path.join(output,file);
      
          fs.rename(sourcePath,destinationPath,function(err){
            if(err){throw err}
            console.log(`Moved ${file} successfully`);
          });
        });
      });
}