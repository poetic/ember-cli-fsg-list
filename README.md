# Ember-cli-fsg-list
fsg-list is a filterable, sortable, and groupable component for a list.
You can also assign custom action to the items in the list.
It is really helpful when you want to create something like this:
<!---
TODO: use a dynamic gif to replace this
-->
filter: a
- A
- *A*merica
- *A*rgentina
- C
- C*a*nada
- Chin*a*

# Example:

- In your controller 'app/controllers/demo.js':
```javascript
var DemoController = Ember.Controller.extend({
  list: [
    {id: 1 , name: 'Chun Yang'       , occupation: 'Web Developer'} ,
    {id: 2 , name: 'Dummy A'         , occupation: 'Web Developer'} ,
    {id: 3 , name: 'Dummy B'         , occupation: 'QA'}            ,
    {id: 4 , name: 'Ellen Degeneres' , occupation: 'QA'}            ,
    {id: 5 , name: 'Jackie Chan'     , occupation: 'Manager'}       ,
  ].map(function(obj){
    return Ember.Object.create(obj);
  }),
  // you MUST provide a partial for each item in the list
  itemPartial: 'person',

  // ---------- Filter
  filterTerm: null, // this is bounded to a input element in the template
  // you can assign an array OR a function to filterBy
  filterKeys: ['name'],
  filterFn: function(item){
    return item.get('id') > this.get('filterTerm');
  },

  // ---------- Sort
  // you can assign an array OR a function to sortBy
  sortKeys: ['name', 'occupation:desc', 'id:asc'],
  sortFn: function(a, b){
    return a.get('id') - b.get('id');
  },

  // ---------- Group
  // you can provide a function to groupBy
  groupFn: function(item){
    return item.occupation;
  },

  // ---------- Actions
  actions: {
  }
});
```

- In your template 'app/templates/demo.hbs'
```javascript
{{input value=filterTerm}}
<ul>
  {{fsg-list
    list        = list
    itemPartial = itemPartial
    filterTerm  = filterTerm
    filterBy    = filterKeys
    sortBy      = sortKeys
    groupBy     = groupFn
  }}
</ul>
```

- In your partial template 'app/template/person.hbs'
```html
{{#with item}}
<li class="item">
<!-- _isTitle and _title are provided by the groupBy function -->
  {{#if _isTitle}}
    <span class="title">{{_title}}</span>
  {{else}}
    <span class="id">{{id}}</span>
    <span class="name">{{name}}</span>
    <span class="occupation">{{occupation}}</span>
  {{/if}}
</li>
{{/with}}
```

# Variables:
- list        : Ember array of Ember objects
- itemPartial : string, template name
- filterTerm  : string
- filterBy    : array of strings OR function
- sortBy      : array of strings OR function
- groupBy     : a function
- actionName  : string, action name in your controller

# Emitted variables from the component to the partial template
- item           : Ember object, a object from the input list
- item.\_isTitle : boolean, if this item is a group title
- item.\_title   : string, output of the group function
_ \_selectItem   : function, used to bubble up the action to your controller
