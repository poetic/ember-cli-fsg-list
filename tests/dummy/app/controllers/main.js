import Ember from 'ember';

var MainController = Ember.Controller.extend({
  list: [
    {id: 1, name: 'Chun Yang'   , occupation: 'Web Developer'},
    {id: 2, name: 'Dumy A'      , occupation: 'Web Developer'},
    {id: 3, name: 'Rich Horn'   , occupation: 'QA'}           ,
    {id: 4, name: 'Ben Horn'    , occupation: 'QA'}           ,
    {id: 5, name: 'John Goodman', occupation: 'Manager'}      ,
  ],
  itemPartial: 'person'
});

export default MainController;
