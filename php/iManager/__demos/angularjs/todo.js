/**
 * 自定义外部模块
 */
var mdAlert = angular.module( 'Alert', [] );
mdAlert.factory( 'Alert', function(){
    var Alert = function(){};
    Alert.prototype.notice = function( msg ){
        window.alert(msg);
    }
    return Alert;

} );

var mdApp = angular.module('AffairApp', [ 'Alert' ]);
mdApp.controller('TodoCtrl', function($scope) {
    $scope.todos = [{
        text: 'learn angular',
        done: true
    }, {
        text: 'build an angular app',
        done: false
    }];

    $scope.addTodo = function() {
        $scope.todos.push({
            text: $scope.todoText,
            done: false
        });
        $scope.todoText = '';
    };

    $scope.remaining = function() {
        var count = 0;
        angular.forEach($scope.todos, function(todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function() {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) $scope.todos.push(todo);
        });
    };
});

mdApp.controller('BeenDoneCtrl', function($scope, Alert ) {
    $scope.todos = [{
        text: 'learn angular',
        done: true
    }, {
        text: 'build an angular app',
        done: false
    }];

    $scope.addTodo = function() {
        $scope.todos.push({
            text: '<div style="color:red;">' + $scope.todoText + '</div>',
            done: false
        });
        $scope.todoText = '';
    };

    $scope.remaining = function() {
        var count = 0;
        angular.forEach($scope.todos, function(todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function() {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) $scope.todos.push(todo);
        });
        (new Alert() ).notice( 'removed' );
    };
});
