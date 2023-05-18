const {contextBridge,ipcRenderer}=require("electron")

contextBridge.exposeInMainWorld("electronAPI",{
    openFile:()=>ipcRenderer.invoke("openFile"),
    fileVer:(dir)=>ipcRenderer.invoke("fileVer",dir),
    saveConfig:(config)=>ipcRenderer.send("saveConfig",config),
    loadConfig:()=>ipcRenderer.invoke("loadConfig"),
    update:(url,output,compressed)=>ipcRenderer.send("update",url,output,compressed)
})
