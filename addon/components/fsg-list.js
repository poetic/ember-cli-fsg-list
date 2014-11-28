import Ember from 'ember';

// helpers
var computed = {
  keys: function(sourceKey){
    return function(){
      var source = this.get(sourceKey);
      if(Ember.isArray(source) && source.length > 0) {
        return source;
      }
    }.property(sourceKey + '.[]');
  },

  fn: function(sourceKey){
    return function(){
      var source = this.get(sourceKey);
      if(typeof source === 'function') {
        return source;
      }
    }.property(sourceKey);
  },
};

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
  filterBy: [],

  _filterKeys: computed.keys('filterBy'),
  _filterFn: computed.fn('filterBy'),
  _defaultFilterFn: function(item){
    var purify = function(dirtyStr){
      return dirtyStr.toLowerCase().replace(/\s+/g, '');
    };
    var getValue = function(key){
      return item.get(key);
    };
    var stack  = purify(this.get('_filterKeys').map(getValue).join(''));
    var needle = purify(this.get('filterTerm'));
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
  sortBy: [],

  _sortKeys: computed.keys('sortBy'),
  _sortFn: computed.fn('sortBy'),
  _defaultSortFn: function(a, b){
    var compareValue;
    this.get('_sortKeys').some(function(metaKey){
      var keys = metaKey.split(':');
      var key = keys[0];
      var asc = keys[1] === 'desc' ? -1 : 1;
      var propA = a.get(key);
      var propB = b.get(key);
      compareValue =  Ember.compare(propA, propB) * asc;
      return compareValue;
    });
    return compareValue || 0;
  },

  _fsList: function(){
    var list = this.get('_fList');

    if(this.get('_sortKeys')) {
      return list.sort(this.get('_defaultSortFn').bind(this));
    }
    if(this.get('_sortFn')) {
      return list.sort(this.get('_sortFn').bind(this));
    }
    return list;
  }.property('_fList', '_sortKeys', '_sortFn'),

  // ---------- group
  groupBy: null,

  _fsgList: function(){
    var groupBy = this.get('groupBy');
    var list = this.get('_fsList');

    if(!groupBy){
      return list;
    }

    var groups  = this._groupsFromList(list, groupBy);
    var fsgList = this._listFromGroups(groups);

    return fsgList;
  }.property('_fsList'),

  _groupsFromList: function(list, groupBy){
    var addItemToGroup = function(groups, item){
      var key = groupBy(item);
      if(groups[key]){
        groups[key].push(item);
      } else {
        groups[key] = [item];
      }
      return groups;
    };

    return list.reduce(addItemToGroup, {});
  },

  _listFromGroups: function(groups){
    var list = [];
    for(var key in groups){
      var titleObj = {_isTitle: true, _title: key};
      list.pushObject(titleObj);
      list.pushObjects(groups[key]);
    }
    return list;
  },

  fsgList: Ember.computed.alias('_fsgList'),
});

export default FilteredSortedGroupedListComponent;
