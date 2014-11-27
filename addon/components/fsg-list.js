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

  filterFn: null,

  _fList: function(){
    // do not filter if there is no filter keys or a filter term
    var filterEnabled = this.get('filterTerm') && this.get('filterKeys') && this.get('filterFn');
    var list = this.get('list');

    if(filterEnabled){
      return list.filter(this.filterFn);
    } else {
      return list;
    }
  }.property('filterTerm', 'filterKeys.[]'),

  // sort
  // TODO: the followng won't work, make a pull request to ember?
  // sortOrder: []
  // _fsList: Ember.computed.sort('_fList', 'sortOrder')

  sortOrder: [],

  _fsList: function(){
    var sortEnabled = this.sortOrder && this.sortOrder.length;
    var fList = this.get('_fList');

    if(sortEnabled){
      return fList;
    } else {
      return fList.sortBy.apply(fList, this.get('sortOrder'));
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
  fsgList: Ember.computed.alias('_fsgList')
});

export default FilteredSortedGroupedListComponent;
