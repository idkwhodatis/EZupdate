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
        async saveConfig(){
            this.config.push({name:this.name,dir:this.dir,ver:this.ver,url:this.url})
            await window.electronAPI.saveConfig(JSON.stringify(this.config,null,2));
            this.closeAddDialog();
        },
        async test(){
            const config=await window.electronAPI.loadConfig();
            console.log(config);
        },

    },
    async mounted(){
        const config=await window.electronAPI.loadConfig();
        this.config=JSON.parse(config);
    }
}
const a=Vue.createApp(app).mount("#app");