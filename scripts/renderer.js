const app={
    data(){
        return{
            showAddDialog:true,
            dir:""
        }
    },
    methods:{
        openAddDialog(){
            this.showAddDialog=true;
        },
        closeAddDialog(){
            this.showAddDialog=false;
        },
        async openFile(){
            const filePath=await window.electronAPI.openFile();
            this.dir=filePath;
        },
        test(){
            console.log("sb");
            this.dir="sb";
        }
    }
}
Vue.createApp(app).mount("#app");