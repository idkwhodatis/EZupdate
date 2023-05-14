const app={
    data(){
        return{
            showAddDialog:false,
            name:"",
            dir:"",
            ver:"",
            url:"",
            config:[]
        }
    },
    methods:{
        openAddDialog(){
            this.showAddDialog=true;
        },
        closeAddDialog(){
            this.showAddDialog=false;
            this.name="";
            this.dir="";
            this.ver="";
            this.url="";
        },
        async openFile(){
            const dir=await window.electronAPI.openFile();
            this.dir=dir;
            const ver=await window.electronAPI.fileVer(dir);
            this.ver=ver;
        },
        saveConfig(){
            this.config.push({name:this.name,dir:this.dir,ver:this.ver,url:this.url})
            console.log(JSON.stringify(this.config));
            console.log(typeof JSON.stringify(this.config));
            window.electronAPI.saveConfig(JSON.stringify(this.config,null,2));
        },
        test(){
            console.log("sb");
            this.dir="sb";
        }
    },
    mounted(){
        console.log(window.electronAPI.loadConfig());
        this.config=JSON.parse(window.electronAPI.loadConfig());
    }
}
Vue.createApp(app).mount("#app");