const app={
    data(){
        return{
            showAddDialog:false,
            dialogMode:"",
            showDelDialog:false,
            showSelectDialog:true,
            id:"",
            name:"",
            dir:"",
            ver:"",
            url:"",
            config:[],
            pending:[{index:0,name:"test1",v1:"1.1.5",v2:"v2.3",update:true},{index:1,name:"test2",v1:"1.3.5",v2:"5.5",update:true}],
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
            this.pending=[];
            for(i in this.config){
                fetch("https://api.github.com/repos/"+this.config[i].url.replace(/(https?:\/\/)?github\.com\//, "")+"/releases")
                    .then(response=>response.json())
                    .then(data=>{
                        if(typeof data[0].tag_name==="undefined"){return}
                        if(compareVer(this.config[i].ver,data[0].tag_name)){
                            this.pending.push({index:i,name:this.config[i].name,v1:this.config[i].ver,v2:data[0].tag_name,update:true});
                        }
                    })
                    .catch((error)=>console.error('Error:',error));
            }
        },
        update(){
            for(i in this.pending){
                if(this.pending[i].update){
                    fetch("https://api.github.com/repos/"+this.config[this.pending[i].index].url.replace(/(https?:\/\/)?github\.com\//, "")+"/releases")
                        .then(response=>response.json())
                        .then(data=>{
                            if(data[0].asserts.length==0){
                                window.electronAPI.update(data[0].zipball_url,this.config[this.pending[i].index].dir,"comp");
                            }else{
                                temp=getUrl(data[0].asserts);
                                window.electronAPI.update(temp[0],this.config[this.pending[i].index].dir,temp[1]);
                            }
                            
                        })
                        .catch((error)=>console.error('Error:',error));
                    }
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
    // v1 is local, v2 is remote
    v1=v1.replace(/^v/,"").split(".");
    v2=v2.replace(/^v/,"").split(".");
    for(let i;i<Math.max(v1.length,v2.length);i++){
        if(parseInt(v1[i] || '0')!==parseInt(v2[i] || '0')){
            return v1>v2 ? false:true;
        }
    }
    return false;
}

function getUrl(arr){
    var compressed="";
    let rank=arr.map((o)=>{
        let score=0;
        if(o.name.includes("win64")){
            score+=4;
        }
        if(o.name.includes("win") || o.name.includes("windows")){
            score+=3;
        }
        if(o.name.endsWith(".exe")){
            score+=2;
        }
        if(o.name.endsWith(".zip") || o.name.endsWith(".rar") || o.name.endsWith(".7z")|| o.name.endsWith(".tar.gz")){
            score+=1;
        }
        return {...o,score:score};
    });

    rank.sort((a,b)=>b.score-a.score);
    if(rank[0].name.endsWith(".zip")){
        compressed="zip";
    }
    if(rank[0].name.endsWith(".rar")){
        compressed="rar";
    }
    if(rank[0].name.endsWith(".7z")){
        compressed="7z";
    }
    if(rank[0].name.endsWith(".tar.gz")){
        compressed="tar";
    }
    return rank.length ? [rank[0].browser_download_url,compressed]:[null,null];
}