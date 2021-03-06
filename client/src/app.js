const TravelForm = require("./views/form_views/travel_form_view.js")
const TravelCalculator = require("./models/travel.js")
const LifestyleView = require('./views/form_views/lifestyle_form_view.js');
const LifestyleModel = require('./models/lifestyle.js');
const FoodView = require('./views/form_views/food_form_view.js');
const FoodModel = require('./models/food.js');
const ResultView = require('./views/result_view.js');
const TotalCalculator = require('./models/total.js');
const PubSub = require('./helpers/pub_sub.js');
// const TotalCalculatorPublish = require('./views/form_views/final_view.js')
const Highcharts = require('highcharts');

document.addEventListener("DOMContentLoaded", () => {

  const formContainer = document.querySelector("#forms-window");
  const newFormTravel = new TravelForm(formContainer);
  newFormTravel.createForm();
  newFormTravel.bindEvents();
  newFormTravel.getResults();

  const travelCalculator = new TravelCalculator();
  travelCalculator.bindEvents();

  const container = document.querySelector('#forms-window');
  const lifestyleForm = new LifestyleView(container);
  lifestyleForm.bindEvents();

  const lifestyleValues = new LifestyleModel();
  lifestyleValues.getValues();

  const form = document.querySelector('#forms-window');
  const newForm = new FoodView(form);
  newForm.bindEvents();

  const foodValues = new FoodModel();
  foodValues.getFormValues();

  const resultView = document.querySelector('#forms-window');
  const resultForm = new ResultView(container);
  resultForm.bindEvents();
  resultForm.findValues();

  const total = new TotalCalculator();
  total.bindEvents();
});
