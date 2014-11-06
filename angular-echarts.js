/*!
 * angular-echarts.js v0.0.1 - echarts for angular
 * Copyright (c) 2014 xuhuan - https://github.com/xuhuan/angular-echarts
 * License: BSD
 */

(function(angular) {

    if (!angular) {
        return;
    }
    angular.module('angularEcharts', [])
        .directive('angularEcharts', function() {
            return {
                template: '<div></div>',
                restrict: 'EA',
                scope: {
                    width: '=',
                    height: '=',
                    options: '=',
                    events: '=',
                    broadcasts: '='
                },
                replace: true,
                link: function postLink(scope, element, attrs) {
                    element.height(scope.height || 400);
                    scope.width && element.width(scope.width);
                    var setOptions = function() {
                        if (!scope.options) {
                            scope.chart.showLoading({
                                text: '正在努力的读取数据中...',
                            });
                            return;
                        }

                        if (!scope.chart) {
                            scope.chart = echarts.init(element[0]);
                        };
                        scope.chart.hideLoading();

                        scope.options && scope.chart.setOption(scope.options);
                    }

                    var setEvents = function() {
                        if (!scope.events || !angular.isObject(scope.events))
                            return;
                        if (!scope.chart) {
                            setOptions();
                        };
                        var keys = Object.getOwnPropertyNames(scope.events);

                        for (var i = 0; i < keys.length; i++) {
                            scope.chart.un(keys[i], scope.events[keys[i]]);
                            scope.chart.on(keys[i], scope.events[keys[i]]);
                        };
                    }

                    var setBroadcast = function() {
                        if (!scope.broadcasts || !angular.isObject(scope.broadcasts))
                            return;
                        if (!scope.chart) {
                            setOptions();
                        };
                        var keys = Object.getOwnPropertyNames(scope.broadcasts);


                        for (var i = 0; i < keys.length; i++) {
                            var _key = keys[i];
                            scope.$on(_key, function(event, data) {
                                if (angular.isFunction(scope.broadcasts[_key])) {
                                    scope.broadcasts[_key](event, data, scope.chart);
                                } else {
                                    if (/(resize|refresh|restore|clear|dispose)/g.test(data)) {
                                        scope.chart[data]();
                                    };
                                }
                            });
                        };
                    }

                    scope.$watch(function() {
                        return scope.events;
                    }, function(newValue, oldValue) {
                        if (newValue) {
                            setEvents();
                        }
                    }, true);


                    scope.$watch(function() {
                        return scope.broadcasts;
                    }, function(newValue, oldValue) {
                        if (newValue) {
                            setBroadcast();
                        }
                    }, true);

                    scope.$watch(function() {
                        return scope.options;
                    }, function(newValue, oldValue) {
                        !scope.width && scope.chart && scope.chart.resize();
                        if (newValue) {
                            setOptions();
                        }
                    }, true);
                }
            };
        });


}(window.angular));
