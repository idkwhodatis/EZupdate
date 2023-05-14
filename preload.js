const {contextBridge,ipcRenderer}=require("electron")

contextBridge.exposeInMainWorld("electronAPI",{
    openFile:()=>ipcRenderer.invoke("openFile"),
    fileVer:(dir)=>ipcRenderer.invoke("fileVer",dir),
    saveConfig:(config)=>{ipcRenderer.invoke("saveConfig",config)},
    readConfig:()=>ipcRenderer.invoke("readConfig")
})
