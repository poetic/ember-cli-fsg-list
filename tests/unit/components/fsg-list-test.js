import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';
import startApp from '../../helpers/start-app';
var App;

// list data used for testing;
var list = [
  {id: 1 , name: 'Chun Yang'       , occupation: 'Web Developer'} ,
  {id: 2 , name: 'Dummy A'         , occupation: 'Web Developer'} ,
  {id: 3 , name: 'Dummy B'         , occupation: 'QA'}            ,
  {id: 4 , name: 'Ellen Degeneres' , occupation: 'QA'}            ,
  {id: 5 , name: 'Jackie Chan'     , occupation: 'Manager'}       ,
].map(function(obj){
  return Ember.Object.create(obj);
});
list = Ember.A(list);

moduleForComponent('fsg-list', 'FsgListComponent', {
  // specify the other units that are required for this test
  needs: ['template:person'],
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, App.destroy);
  }
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});

test('it shows a list of partials', function(){
  expect(list.length);

  var component = this.subject();
  component.set('list', list);
  component.set('itemPartial', 'person');
  this.append();

  andThen(function(){
    var items = $('.item');
    list.forEach(function(item, index){
      var name = items.eq(index).find('.name').text();
      equal(name, item.get('name'));
    });
  });
});

test('it should filter the list by filterTerm and filter(filterKeys)', function(){
  expect(5);

  var component = this.subject();
  component.set('list', list);
  component.set('itemPartial', 'person');
  component.set('filterTerm', 'Chun');
  component.set('filter', ['name']);
  this.append();

  andThen(function(){
    var items = $('.item');
    list.forEach(function(item){
      var selector = '.name:contains("' + item.get('name') + '")';
      var exist = !!items.find(selector).length;
      if(item.get('name') === 'Chun Yang'){
        equal(exist, true);
      } else {
        equal(exist, false);
      }
    });
  });

  // push new object to list
  // andThen(function(){
  //   list.pushObject(Ember.Object.create({
  //     id: 100, name: 'Mike Chun', occupation: 'Web Designer'
  //   }));
  // });

  // andThen(function(){
  //   equal($('.item').length, 2);
  // });

  // andThen(function(){
  //   list.popObject();
  // });
  // TODO: change add new key to filter
});

test('it should filter the list by filterTerm and filter(filterFn)', function(){
  expect(5);

  var component = this.subject();
  component.set('list', list);
  component.set('itemPartial', 'person');
  component.set('filterTerm', 'Chun');
  component.set('filter', function(item){
    return item.get('id') > 3;
  });
  this.append();

  andThen(function(){
    var items = $('.item');
    list.forEach(function(item){
      var selector = '.id:contains("' + item.get('id') + '")';
      var exist = !!items.find(selector).length;
      if(item.get('id') > 3){
        equal(exist, true);
      } else {
        equal(exist, false);
      }
    });
  });
});
