class SidebarController {
    constructor() {

    }
    public openNav() {
       document.getElementById("mySidenav").style.width = "inherit";
       document.getElementById("sidenavContainer").setAttribute('class', 'col-xs-12 col-md-3');
       document.getElementById("map").setAttribute('class', 'col-xs-0 col-md-9');
   }


    public closeNav() {
       document.getElementById("mySidenav").style.width = "0";
       document.getElementById("sidenavContainer").setAttribute('class', 'col-xs-0');
       document.getElementById("map").setAttribute('class', 'col-xs-12');
   }
}
export default SidebarController;
