class SidebarController {
    constructor() {

    }
    public openNav() {
       document.getElementById("mySidenav").style.width = "250px";
   }

   /* Set the width of the side navigation to 0 */
    public closeNav() {
       document.getElementById("mySidenav").style.width = "0";
   }
}
export default SidebarController
