import * as angular from 'angular';
import {scaleLinear} from 'd3-scale';
class DataKeyController{
  private canvas;
  private ctx;
  constructor(private $rootScope){
    console.log('dataKey')
    this.canvas = document.getElementById('dataKeyCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.$rootScope.$on('createKey', (data) => {
      console.log('createKey');
      console.log(data);
      this.drawKey(data.min,data.max);
    })
  }
  private drawKey(min,max){

  }
}

DataKeyController.$inject = ['$rootScope'];

export default DataKeyController;
