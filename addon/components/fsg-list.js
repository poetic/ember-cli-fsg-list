import Ember from 'ember';

var FilteredSortedGroupedListComponent = Ember.Component.extend({
  list: [],

  // itemPartial
  itemPartial: '',

  // itemAction
  itemAction: null,
  actions: {
    selectItem: function(){
      if(!this.get('itemAction')){
        return;
      }

      // TODO: refactor after tests
      // this.sendAction.bind(this, 'itemAction').apply(this, args);
      var args = Array.prototype.slice.call(arguments).unshift('itemAction');
      this.sendAction.apply(this, args);
    }
  },

  // ---------- filter
  filterTerm: null,
  // filter can be a function of an array of list item keys
  // function : function(item, index, list)
  // keys     : ['id', 'name']
  filter: [],

  _filterKeys: function(){
    var filter = this.get('filter');
    if(typeof filter !== 'function' && filter.length > 0) {
      return this.get('filter');
    }
  }.property('filter.[]'),

  _filterFn: function(){
    if(typeof this.get('filter') === 'function') {
      return this.get('filter');
    }
  }.property('filter'),

  _defaultFilterFn: function(item){
    var addString = function(result, key){
      return result + item.get(key);
    };
    var stack = this.get('_filterKeys').reduce(addString, '');
    stack = this._purify(stack);
    var needle = this._purify(this.get('filterTerm'));
    return stack.indexOf(needle) > -1;
  },

  _fList: function(){
    var list = this.get('list');

    if(!this.get('filterTerm')){
      return list;
    }
    if(this.get('_filterKeys')) {
      return list.filter(this.get('_defaultFilterFn').bind(this));
    }
    if(this.get('_filterFn')) {
      return list.filter(this.get('_filterFn').bind(this));
    }
    return list;
  }.property('list.[]', 'filterTerm', '_filterKeys', '_filterFn'),

  // ---------- sort
  // TODO: the followng won't work, make a pull request to ember?
  // sortOrders: []
  // _fsList: Ember.computed.sort('_fList', 'sortOrders')

  sortOrders: [],

  _fsList: function(){
    var sortEnabled = this.get('sortOrders') && this.sortOrders.length;
    var fList = this.get('_fList');

    if(sortEnabled){
      return fList;
    } else {
      return fList.sortBy.apply(fList, this.get('sortOrders'));
    }
  }.property('_fList'),

  // ---------- group
  groupFn: null,
  titleKeys: [],

  _fsgList: function(){
    var groupEnabled = this.get('groupFn');
    var fsList = this.get('_fsList');

    if(!groupEnabled){
      return fsList;
    }

    var groups = this._groupBy(this.get('_fsList'), this.get('groupFn'));
    var fsgList = [];

    // add items to the list
    for(var key in groups){
      var titleObj = {_isTitle: true, title: key};
      fsgList.pushObject(titleObj);
      fsgList.pushObjects(groups[key]);
    }

    return fsgList;
  }.property('_fsList'),

  _groupBy: function(list, groupFn){
    var addItemToGroup = function(groups, item){
      var key = groupFn(item);
      if(groups[key]){
        groups[key].push(item);
      } else {
        groups[key] = [item];
      }
      return groups;
    };

    return list.reduce(addItemToGroup, {});
  },

  // result
  fsgList: Ember.computed.alias('_fsgList'),

  // helper fns
  _purify: function(dirtyStr){
    return dirtyStr.toLowerCase().replace(/\s+/g, '');
  },
});

export default FilteredSortedGroupedListComponent;
