import {scaleLinear} from 'd3-scale';
import {ticks} from 'd3-scale';
class LegendController {
  private legendTickGroup;
  private legendGradient;
  private dataTicks;
  private scale;
  private min;
  private max;
  private svg;
  // private canvas;
  // private ctx;
  constructor(private $rootScope) {
    this.legendTickGroup = document.getElementById('legendTickMarks');
    this.legendGradient = document.getElementById('legendGradient');
    this.svg = document.getElementById('legendSvg');
    console.log(this.svg.width);
    // this.canvas = document.getElementById('legendCanvas');
    // this.ctx = this.canvas.getContext('2d');

    this.$rootScope.$on('createLegend', (event,data) => {
      this.generateScale(data.min,data.max)
        .then(() => {
          this.drawLegend();
        })

    })
  }
  private generateScale(min,max){

    min = parseFloat(min);
    max = parseFloat(max);
    return new Promise((resolve, reject) => {
      this.scale = scaleLinear()
                     .domain([min,max])
                     .range([this.svg.width.animVal.value*0.125,this.legendGradient.width.animVal.value*1.125]);
      this.dataTicks = [min,((min + max)/2),max];
      resolve();
    })

  }
  private drawLegend(){
    // I decided since there was only one point in the application to need to create this type of of viz, that
    // it was a more lightweight solution to do this manually rather than importing additional d3 microlibraries.
    while(this.legendTickGroup.firstChild){
      this.legendTickGroup.removeChild(this.legendTickGroup.firstChild);
    }
    let middle = document.createElementNS('http://www.w3.org/2000/svg','rect');
    middle.setAttribute('x',`${(this.legendGradient.width.animVal.value*1.25)/2}`);
    middle.setAttribute('y','25');
    middle.setAttribute('height','25');
    middle.setAttribute('width','1');
    this.legendTickGroup.appendChild(middle);
    this.dataTicks.forEach((tick) => {
      let label = document.createElementNS('http://www.w3.org/2000/svg','text');
      label.setAttribute('x',`${this.scale(tick)}`);
      label.setAttribute('y','25');
      label.setAttribute('height','25');
      label.setAttribute('font-family','sans-serif');
      label.setAttribute('font-size','25');
      label.setAttribute('fill','black');
      label.setAttribute('text-anchor','middle');
      this.legendTickGroup.appendChild(label);
      label.appendChild(document.createTextNode(tick.toString()));
//font-family="sans-serif" font-size="20px" fill="red"

    })
  }
 }
 LegendController.$inject = ['$rootScope'];

export default LegendController;
