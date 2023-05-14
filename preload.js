const {contextBridge,ipcRenderer}=require("electron")
const fs=require("fs")

contextBridge.exposeInMainWorld("electronAPI",{
    openFile:()=>ipcRenderer.invoke("openFile"),
    fileVer:(dir)=>ipcRenderer.invoke("fileVer",dir),
    readConfig:()=>{
        fs.readFile(path.join(__dirname,"config.json"),"utf8",function(err,data){
            if(err){
                return
            }
            return JSON.parse(data);
        })
    },
    saveConfig:(config)=>{
        fs.writeFile(path.join(__dirname,"config.json"),JSON.stringify(config),"utf8",function(err){
            if(err){
                return
            }
        })
    }
})
