const app={
    data(){
        return{
            showAddDialog:false,
            name:"",
            dir:"",
            ver:"",
            url:"",
            software:[{name:"Test App",dir:"C:/sb/download/out/in/test/sb/ez.exe",ver:"1.0.1",url:"https://www.runoob.com/html/html-tables.html"},{name:"sbb",dir:"sb",ver:"sb",url:"sb"}]
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
        test(){
            console.log("sb");
            this.dir="sb";
        }
    }
}
Vue.createApp(app).mount("#app");