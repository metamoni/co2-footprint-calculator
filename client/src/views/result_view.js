const PubSub = require('../helpers/pub_sub.js');
const Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);
const TotalCalculator = require("../models/total.js");
const Recommend = require('../models/recommend.js');

const ResultView = function (container) {
  this.container = container;
  this.travel = 50;
  this.food = 75;
  this.lifestyle = 25;
  this.all = 0;
};

ResultView.prototype.bindEvents = function () {
 const menuItem = document.querySelector("#result-menu-item");
 menuItem.addEventListener("click", (event) => {
const detail = event.target.detail
 PubSub.publish('PublishView:final-result', detail)
 });
};

ResultView.prototype.findValues = function () {

  PubSub.subscribe('FoodInfo', (event) => {
      this.food = event.detail;
  });

  PubSub.subscribe('TravelForm:display-results', (event) => {
    this.travel = event.detail;
  });

  PubSub.subscribe('LifestyleView:result', (event) => {
    this.lifestyle = event.detail;
  });

  PubSub.subscribe('PublishView:final-result', (event) => {
    this.all = event.detail;
    this.render();
    this.randomize(this.food, this.travel, this.lifestyle);
    this.chart();
    });
};

// ResultView.prototype.calculate = function(info) {
//   const porcentage = Math.ceil((info*23)/450)
//   return porcentage
// }

ResultView.prototype.randomize = function (food, travel, lifestyle) {

  const randomQuote = new Recommend;
  const maxNumber = Math.max(food, travel, lifestyle)
  if (maxNumber === food) {
    randomQuote.generate("food")
  } else if (maxNumber === travel) {
    randomQuote.generate("travel");
  } else if (maxNumber === lifestyle) {
    randomQuote.generate("lifestyle");
  } else {
    randomQuote.generate("lifestyle");
  }

  return randomQuote;
};

ResultView.prototype.render = function () {
  this.container.innerHTML = "";

   const foodParagraph = document.createElement('p');
   foodParagraph.textContent = `Food: ${this.food}`;

   const travelParagraph = document.createElement('p');
   travelParagraph.textContent = `Travel: ${this.travel}`;

   const lifestyleParagraph = document.createElement('p');
   lifestyleParagraph.textContent = `Lifestyle: ${this.lifestyle}`;

   const allParagraph = document.createElement('p');
   allParagraph.textContent = `Total: ${this.all}`;

   this.container.appendChild(foodParagraph);
   this.container.appendChild(travelParagraph);
   this.container.appendChild(lifestyleParagraph);
   this.container.appendChild(allParagraph);
};

ResultView.prototype.chart = function () {

Highcharts.theme = {
  colors: ['#CD5C5C', '#20B2AA', '#3CB371', '#4682B4'],
  title: {
          style: {
              color: 'white',
              font: '22px "Raleway",sans-serif',
              textTransform: 'uppercase',
              marginTop: 70
          }
        },
  legend: {
        itemStyle: {
            color: 'white',
            font: "'Raleway', sans-serif",
            textTransform: 'uppercase'
        }
      }
};

Highcharts.setOptions(Highcharts.theme);

  const myChart = document.createElement("form")
  myChart.id = "result-view"
  const theChart = Highcharts.chart(myChart, {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor: '#BBCBCB'

    },
    title: {
        text: `${this.getTitle()}`,
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
       pie: {
           allowPointSelect: true,
           cursor: 'pointer',

           dataLabels: {
               enabled: false
           },
           showInLegend: true
       }
    },
    series: [{
        name: 'Percentage',
        colorByPoint: true,
        data: [{
            name: 'Food',
            y: this.food,
            sliced: true,
            selected: true
        },

        {  name: 'Travel',
            y: this.travel
        }, {
            name: 'Lifestyle',
            y: this.lifestyle
        }]
    }]
});

this.container.innerHTML = "";
const result = this.container.appendChild(myChart)
}

ResultView.prototype.getTitle = function () {
  if (this.travel == 50 && this.food == 75 && this.lifestyle == 25){
    return `Average Consumption`;
  } else {
    return `Your CO2 Consumption!`;
  }
  };


module.exports = ResultView;
