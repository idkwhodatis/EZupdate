const app={
    data(){
        return{
            showAddDialog:false,
            dialogMode:"",
            showDelDialog:false,
            id:"",
            name:"",
            dir:"",
            ver:"",
            url:"",
            config:[],
            test:""
        }
    },
    methods:{
        openAddDialog(){
            this.showAddDialog=true;
            this.dialogMode="add";
        },
        openEditDialog(id){
            this.showAddDialog=true;
            this.dialogMode="edit";
            this.id=id;
            this.name=this.config[id].name;
            this.dir=this.config[id].dir;
            this.ver=this.config[id].ver;
            this.url=this.config[id].url;
        },
        closeAddDialog(){
            this.showAddDialog=false;
            this.dialogMode="";
            this.id="";
            this.name="";
            this.dir="";
            this.ver="";
            this.url="";
        },
        openDelDialog(id){
            this.showDelDialog=true;
            this.id=id;
        },
        closeDelDialog(){
            this.showDelDialog=false;
            this.id="";
        },
        async openFile(){
            const dir=await window.electronAPI.openFile();
            this.dir=dir;
            const ver=await window.electronAPI.fileVer(dir);
            this.ver=ver;
        },
        async saveConfig(){
            this.config.push({id:getNewID(this.config),name:this.name,dir:this.dir,ver:this.ver,url:this.url});
            await window.electronAPI.saveConfig(JSON.stringify(this.config,null,2));
            this.closeAddDialog();
        },
        async editConfig(){
            this.config=this.config.map(item=>item.id===this.id ? {id:this.id,name:this.name,dir:this.dir,ver:this.ver,url:this.url}:item);
            await window.electronAPI.saveConfig(JSON.stringify(this.config,null,2));
            this.closeAddDialog();
        },
        async delConfig(){
            this.config=this.config.filter(item=>item.id!==this.id);
            await window.electronAPI.saveConfig(JSON.stringify(this.config,null,2));
            this.closeDelDialog();
        },
        checkUpdate(){
            for(i in this.config){
                fetch("https://api.github.com/repos/"+this.config[i].url.replace(/(https?:\/\/)?github\.com\//, "")+"/releases")
                    .then(response=>response.json())
                    .then(data=>{
                        if(typeof data[0].tag_name==="undefined"){return}
                        if(compareVer(i.ver,data[0].tag_name)){

                        }
                    })
                    .catch((error)=>console.error('Error:',error));
            }
        },
        async test1(){
            fetch("https://api.github.com/repos/idkwhodatis/EZupdate/releases")
                .then(response=>response.json())
                .then(data=>console.log(data.tag_name))
                .catch((error)=>console.log(error))
        },

    },
    async mounted(){
        const config=await window.electronAPI.loadConfig();
        this.config=JSON.parse(config);
    }
}
const a=Vue.createApp(app).mount("#app");

function getNewID(arr){
    if(arr.length==0){
        return 0;
    }
    return Math.max(...arr.map(o=>o.id))+1;
}

function compareVer(v1,v2){
    v1=oldV.replace(/^v/,"").split(".");
    v2=newV.replace(/^v/,"").split(".");
    for(let i;i<Math.max(v1.length,v2.length);i++){
        if(parseInt(v1[i] || '0')!==parseInt(v2[i] || '0')){
            return v1>v2 ? false:true;
        }
    }
    return false;
}