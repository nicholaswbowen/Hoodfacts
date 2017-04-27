import {scaleLinear} from 'd3-scale';
import {ticks} from 'd3-scale';
class LegendController {
  private legendTickMarks;
  private legendGradient;
  private dataTicks;
  private scale;
  private min;
  private max;
  private svg;
  private displayLoading:boolean;
  // private canvas;
  // private ctx;
  constructor(private $rootScope) {
    this.displayLoading = true;
    this.legendTickMarks = document.getElementById('legendTickMarks');
    this.legendGradient = document.getElementById('legendGradient');
    this.svg = document.getElementById('legendSvg');
    // this.canvas = document.getElementById('legendCanvas');
    // this.ctx = this.canvas.getContext('2d');

    this.$rootScope.$on('createLegend', (event,data) => {
      this.clearLegend();
      this.displayLoading = false;
      this.generateScale(data.min,data.max)
        .then(() => {
          if (isFinite(data.min) && isFinite(data.max)){
            this.drawLegend();
          }else{
            this.displayError();
          }

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
  private displayLoadingMessage(){

  }
  private displayError(){
    let errorLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
    errorLabel.setAttribute('x',`${this.svg.width.animVal.value/2}`);
    errorLabel.setAttribute('y','25');
    errorLabel.setAttribute('height','25');
    errorLabel.setAttribute('font-family','sans-serif');
    errorLabel.setAttribute('font-size','25');
    errorLabel.setAttribute('fill','black');
    errorLabel.setAttribute('text-anchor','middle');
    this.legendTickMarks.appendChild(errorLabel);
    errorLabel.appendChild(document.createTextNode('No Data for this Area.'));
  }
  private clearLegend(){
    while(this.legendTickMarks.firstChild){
      this.legendTickMarks.removeChild(this.legendTickMarks.firstChild);
    }
  }
  private drawLegend(){
    // I decided since there was only one point in the application to need to create this type of of viz, that
    // it was a more lightweight solution to do this manually rather than importing additional d3 microlibraries.
    let middle = document.createElementNS('http://www.w3.org/2000/svg','rect');
    middle.setAttribute('x',`${this.svg.width.animVal.value/2}`);
    middle.setAttribute('y','35');
    middle.setAttribute('height','25');
    middle.setAttribute('width','1');
    this.legendTickMarks.appendChild(middle);
    this.dataTicks.forEach((tick) => {
      let label = document.createElementNS('http://www.w3.org/2000/svg','text');
      label.setAttribute('x',`${this.scale(tick)}`);
      label.setAttribute('y','25');
      label.setAttribute('height','25');
      label.setAttribute('font-family','sans-serif');
      label.setAttribute('font-size','25');
      label.setAttribute('fill','black');
      label.setAttribute('text-anchor','middle');
      this.legendTickMarks.appendChild(label);
      label.appendChild(document.createTextNode(tick.toFixed(2).toString()));
//font-family="sans-serif" font-size="20px" fill="red"

    })
  }
 }
 LegendController.$inject = ['$rootScope'];

export default LegendController;
