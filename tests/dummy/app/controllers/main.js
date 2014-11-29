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

  // ---------- Filter
  filterTerm: null,
  filterKeys: ['name'],
  filterFn: function(item){
    return item.get('id') > this.get('filterTerm');
  },

  // ---------- Sort
  sortKeys: function(){
    var orders = [];

    ['occupationOrder', 'nameOrder'].forEach(function(orderKey){
      if(this.get(orderKey)){
        orders.pushObject(orderKey.replace(/Order$/, ':') + this.get(orderKey));
      }
    }.bind(this));

    return orders;
  }.property('occupationOrder', 'nameOrder'),
  sortFn: function(a, b){
    return b.get('id') - a.get('id');
  },

  // ---------- Group
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
    clickItem: function(item){
      var element = Ember.$('.id:contains("' + item.get('id') + '")');
      element.parent().toggleClass('active');
    },
  }
});

export default MainController;
