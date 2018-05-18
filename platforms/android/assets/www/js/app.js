// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ecoApp', ['ui.router','ecoApp.controllers','ngCookies','ngMessages','mwl.calendar','ngAnimate','colorpicker.module','ui.bootstrap'])
.run(['$rootScope','$state', function($rootScope,$state) {
    if (window.sessionStorage.getItem('poolData') == null)
    {
        AWSCognito.config.region = 'ap-southeast-1';
        var poolData = {
            UserPoolId : 'ap-southeast-1_Rx7V8qhLD', // your user pool id here
            ClientId : '63bpj037fiitgjpkaeuiub2mb8' // your app client id here
        };
        //var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        window.sessionStorage.setItem('poolData',JSON.stringify(poolData));

    }
    if (window.localStorage.getItem('lang') == null)
    {
        window.localStorage.setItem('lang', "en");
    }
    console.log('Language: ',window.localStorage.getItem('lang'));

    $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
        //Change page title, based on Route information
        //$rootScope.title = $route.current.title;
    });

}])

.directive('uiSref',['$rootScope',function($rootScope){
  return {
    link: function(scope, element, attr){
        element.on('click', function(event){
        //$rootScope.title = element[0].innerText;
      });
    }
  }
}])

.directive('showList', function() {
   return {
       restrict: 'A',
       link: function(scope, iEle) {
           iEle.focus(function() {
               iEle.trigger('input');
           });
       }
   };
})

.factory('alert', function($uibModal) {

  function show(action, event) {
    return $uibModal.open({
      templateUrl: 'templates/modalContent.html',
      controller: function() {
        var vm = this;
        vm.action = action;
        vm.event = event;
      },
      controllerAs: 'vm'
    });
  }

  return {
    show: show
  };

})

.factory('Show',function(){
  return {text:''};
})

.factory('Hide',function(){
  return {text:''};
})

.config(['calendarConfig', function(calendarConfig) {

   // View all available config
   console.log(calendarConfig);

   // Change the month view template globally to a custom template
  // calendarConfig.templates.calendarMonthView = 'path/to/custom/template.html';

   // Use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.
   //calendarConfig.dateFormatter = 'moment';

   // This will configure times on the day view to display in 24 hour format rather than the default of 12 hour
   calendarConfig.allDateFormats.angular.date.hour = 'HH:mm';

   // This will configure the day view title to be shorter
   //calendarConfig.allDateFormats.angular.title.day = 'ddd D MMM';
   calendarConfig.allDateFormats.angular.date.weekDay = 'EEE';
   calendarConfig.showTimesOnDayView = false;
   // This will set the week number hover label on the month view
   //calendarConfig.i18nStrings.weekNumber = 'Week {week}';

   // This will display all events on a month view even if they're not in the current month. Default false.
   //calendarConfig.displayAllMonthEvents = true;

   // Make the week view more like the day view, ***with the caveat that event end times are ignored***.
   //calendarConfig.showTimesOnWeekView = true;

 }])

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller: 'homeController',
            onEnter: function ($rootScope) {
              document.getElementById('navbar').style.display = 'block';
               $rootScope.title = "Home";
               //changeLanguage(window.localStorage.getItem('lang'));
            }
        })

        // nested list with custom controller
        .state('home.list', {
            url: '/list',
            templateUrl: 'templates/home-list.html',
            controller: 'homelistController',
            title: 'Home',
            onEnter: function ($rootScope) {
               $rootScope.title = "Home";
               //changeLanguage(window.localStorage.getItem('lang'));
            }
        })

        // nested list with just some random string data
        .state('home.paragraph', {
            url: '/paragraph',
            template: 'I could sure use a drink right now.',
            onEnter: function ($rootScope) {
               $rootScope.title = "Home";
               //changeLanguage(window.localStorage.getItem('lang'));
           }
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            url: '/about',
            views: {
                // the main template will be placed here (relatively named)
                '': {
                       templateUrl: 'templates/about.html'
                    },

                // the child views will be defined here (absolutely named)
                'columnOne@about': { template: 'Look I am a column!' },

                // for column two, we'll define a separate controller
                'columnTwo@about': {
                    templateUrl: 'templates/table-data.html',
                    controller: 'scotchController'
                }
            },
            onEnter: function ($rootScope) {
               $rootScope.title = "About";
            }
        })

        .state('services', {
            url: '/services',
            templateUrl: 'templates/services.html'
        })

        .state('pricing', {
            url: '/pricing',
            templateUrl: 'templates/pricing.html'
        })

        .state('user', {
            url: '/user',
            templateUrl: 'templates/user.html'
        })

        .state('scan', {
            url: '/scan',
            templateUrl: 'templates/mailbox.html',
            onEnter: function ($rootScope) {
               $rootScope.title = "Scan";
            }
        })

        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html'
        })

        .state('explorer', {
            url: '/explorer',
            templateUrl: 'templates/explorer.html'
        })

        .state('error', {
            url: '/error',
            templateUrl: 'templates/error.html'
        })

        .state('shop', {
            url: '/shop',
            templateUrl: 'templates/shop.html'
        })

        .state('blogs', {
            url: '/blogs',
            templateUrl: 'templates/blogs.html'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'templates/authentication/login.html',
            controller: 'loginController',
            onEnter: function ($rootScope) {
              //document.getElementById('navbar').style.display = 'none';
              $rootScope.title = "Login";
              $rootScope.show = false;
              //changeLanguage(window.localStorage.getItem('lang'));
            },
            onExit: function ($rootScope) {
             $rootScope.show = true;
             //changeLanguage(window.localStorage.getItem('lang'));
            }
        })

        .state('confirmation', {
            url: '/confirmation',
            templateUrl: 'templates/authentication/confirmation.html',
            controller: 'confirmationController',
            params: {
                'phonenumber': ''
            },
            onEnter: function ($rootScope) {
              $rootScope.title = "Confirmation";
              $rootScope.show = false;
              //changeLanguage(window.localStorage.getItem('lang'));
            },
            onExit: function ($rootScope) {
             $rootScope.show = true;
             //changeLanguage(window.localStorage.getItem('lang'));
            }
        })
/*
        .state('test_login', {
            url: '/test_login',
            templateUrl: 'templates/test_login.html',
            controller: 'testloginController',
            onEnter: function ($rootScope) {
               $rootScope.title = "Login";
               $rootScope.show = "false";
               //changeLanguage(window.localStorage.getItem('lang'));
           },
           onExit: function ($rootScope) {
              $rootScope.show = 'true';
              //changeLanguage(window.localStorage.getItem('lang'));
           }
        })
        */

        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'registerController',
            onEnter: function ($rootScope) {
              //document.getElementById('navbar').style.display = 'none';
               $rootScope.title = "Registration";
            }
        })

        .state('confirm', {
            url: '/confirm',
            templateUrl: 'templates/confirm.html',
            controller: 'confirmController',
            onEnter: function ($rootScope) {
            //  document.getElementById('navbar').style.display = 'none';
               $rootScope.title = "Confirmation";
            }
        })


        .state('forgot_password', {
            url: '/forgot_password',
            templateUrl: 'templates/forgot_password.html',
            controller: 'forgotController',
            onEnter: function ($rootScope) {
               $rootScope.title = "Forgot Password";
            }
        })

        .state('login1', {
            url: '/login1',
            templateUrl: 'templates/login1.html',
            controller: 'login1Controller',
            onEnter: function ($rootScope) {
               $rootScope.title = "Login";
            }
        })

        .state('contact', {
            url: '/contact',
            templateUrl: 'templates/contact.html',
            onEnter: function ($rootScope) {
               $rootScope.title = "Contact";
            }
        })

        .state('ui_elements', {
            url: '/ui_elements',
            templateUrl: 'templates/ui_elements.html'
        })

        .state('scheduleOverview', {
            url: '/scheduleOverview',
            templateUrl: 'templates/scheduleOverview.html',
            controller: 'scheduleController',
            onEnter: function ($rootScope) {
               $rootScope.title = "Schedule";
            }
        })

        .state('scheduleDetail', {
            url: '/scheduleDetail',
            templateUrl: 'templates/scheduleDetail.html',
            controller: 'scheduleController',
            onEnter: function ($rootScope) {
               $rootScope.title = "Schedule";
            }
        })

        .state('photoScanner', {
            url: '/photoScanner',
            templateUrl: 'templates/photoScanner.html',
            controller: 'photoScanner',
            onEnter: function ($rootScope) {
               $rootScope.title = "Photo Scanner";
            }
        })

        .state('uploader', {
            url: '/uploader',
            templateUrl: 'templates/uploader.html',
            controller: 'uploader',
            onEnter: function ($rootScope) {
               $rootScope.title = "Uploader";
            }
        })

        .state('loginform', {
            url: '/loginform',
            templateUrl: 'templates/loginform.html',
            controller: 'loginform',
            onEnter: function ($rootScope) {
               $rootScope.title = "Special Login Form";
            }
        })

        $urlRouterProvider.otherwise('/login');

});
