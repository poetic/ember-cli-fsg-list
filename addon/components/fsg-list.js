import Ember from 'ember';

FilteredSortedGroupedListComponent = Ember.Component.extend({
  list: [],

  itemAction: null,
  actions: {
    selectItem: function(){
      var cp = this;

      if(!cp.get('itemAction')){
        return
      }

      var args = Array.prototype.slice.call(arguments);
      args.unshift('itemAction');
      cp.sendAction.apply(cp, args);
    }
  },

  // classes and ids
  listId: null,
  listClass: null,
  listPartial: '',

  // filter
  filterKeys: [],
  filterTerm: '',

  _filter: function(){
    new Fuse(cp.get('list'), { keys: cp.get('filterKeys') });
  }.property('list.[]', 'filterKeys.[]'),

  _filteredList: function(){
    // do not filter if there is no filter keys or a filter term
    if(!cp.get('filterTerm') || cp.get('filterKeys').length === 0){
      return cp.get('list');
    }

    // restric the search length to avoid error 32 chars
    // Ignore extra long string then 32 (FOR NOW)
    cp.get('_filter').search(cp.get('filterTerm').substr(0, 32) || '');
  }.property('filterTerm', '_filter'),

  // sort
  // TODO: the followng won't work, make a pull request to ember?
  // sortOrder: []
  // _filteredSortedList: Ember.computed.sort('_filteredList', 'sortOrder')

  sortOrder: [],

  _filteredSortedList: function(){
    list = cp.get('_filteredList')
    list.sortBy.apply(list, cp.get('sortOrder'))
  }.property('_filteredList'),

  // group
  groupBy: null,
  titleKeys: [],

  _filteredSortedGroupedList: function(){
    if(!cp.get('groupBy')){
      return cp.get('_filteredSortedList');
    }

    modifiedList = [];
    groupedList = _.groupBy(cp.get('_filteredSortedList'), cp.get('groupBy'));
    _.each(groupedList, function(records, key){
      titleObj = {_isTitle: true, title: key};
      cp.get('titleKeys').forEach(function(titleKey){
        titleObj[titleKey] = records[0][titleKey];
      });
      modifiedList.pushObject(titleObj);
      modifiedList.pushObjects(records);
    });
    modifiedList
  }.property('_filteredSortedList'),

  // result
  modifiedList: Ember.computed.alias('_filteredSortedGroupedList')
})

export default FilteredSortedGroupedListComponent;
