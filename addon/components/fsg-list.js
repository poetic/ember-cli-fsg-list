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

      var args = Array.prototype.slice.call(arguments);
      args.unshift('itemAction');
      this.sendAction.apply(this, args);
    }
  },

  // filter
  filterKeys: [],
  filterTerm: '',
  filterTermPurified: function(){
    return this._purify(this.get('filterTerm'));
  }.property('filterTerm'),
  // implimentation of filter callback in ember Enumerable
  // http://emberjs.com/api/classes/Ember.Enumerable.html#method_filter
  filterFn: function(item){
    var addString = function(result, key){
      return result + item.get(key);
    };
    var stack = this.get('filterKeys').reduce(addString, '');
    stack = this._purify(stack);
    var needle = this.get('filterTermPurified');
    return stack.indexOf(needle) > -1;
  },

  _fList: function(){
    // do not filter if there is no filter keys or a filter term
    var filterEnabled = this.get('filterTerm') &&
                        this.get('filterKeys') &&
                        this.filterFn;
    var list = this.get('list');

    if(filterEnabled){
      return list.filter(this.filterFn.bind(this));
    } else {
      return list;
    }
  }.property('filterTerm', 'filterKeys.[]'),

  // sort
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

  // group
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
