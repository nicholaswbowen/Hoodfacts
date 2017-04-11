class SidebarController {
    constructor() {

    }
    public openNav() {
       document.getElementById("mySidenav").style.width = "250px";
   }

   
    public closeNav() {
       document.getElementById("mySidenav").style.width = "0";
   }
}
export default SidebarController
