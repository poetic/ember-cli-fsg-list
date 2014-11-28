import Ember from 'ember';

var MainController = Ember.Controller.extend({
  list: [
    {id: 1 , name: 'Chun Yang'       , occupation: 'Web Developer'} ,
    {id: 2 , name: 'Dummy A'         , occupation: 'Web Developer'} ,
    {id: 3 , name: 'Dummy B'         , occupation: 'QA'}            ,
    {id: 4 , name: 'Ellen Degeneres' , occupation: 'QA'}            ,
    {id: 5 , name: 'Jackie Chan'     , occupation: 'Manager'}       ,
  ].map(function(obj){
    return Ember.Object.create(obj);
  }),
  itemPartial: 'person',

  filterTerm: null,
  filterKeys: ['name'],
  filterFn: function(item){
    return item.get('id') > this.get('filterTerm');
  },

  sortKeys: function(){
    var orders = [];

    ['occupationOrder', 'nameOrder'].forEach(function(orderKey){
      if(this.get(orderKey)){
        orders.pushObject(orderKey.replace(/Order$/, ':') + this.get(orderKey));
      }
    }.bind(this));

    return orders;
  }.property('occupationOrder', 'nameOrder'),

  groupFn: function(item){
    return item.occupation;
  },

  actions: {
    toggleOrder: function(key){
      if(this.get(key) === 'asc'){
        this.set(key, 'desc');
      } else {
        this.set(key, 'asc');
      }
    },
  }
});

export default MainController;
