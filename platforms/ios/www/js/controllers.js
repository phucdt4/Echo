// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ecoApp.controllers', [])

.controller('photoScanner', function($scope){
    console.log('1234');
    $scope.takepicture = function () {
        console.log('test');
    };
    //window.sessionStorage.setItem('test','23456');
    //console.log(window.sessionStorage.getItem('test'));
    //console.log(angular.element('#Text1').attr('href'));
})

.controller('photoScanner2', function($scope){
    console.log('12345');
    $scope.takepicture = function () {
        console.log('test');
    };
    //window.sessionStorage.setItem('test','23456');
    //console.log(window.sessionStorage.getItem('test'));
    //console.log(angular.element('#Text1').attr('href'));
})

.controller('loginController',['$scope', '$state','$uibModal','$log','$http', function($scope,$state,$uibModal,$log,$http){
    console.log("Test222");
    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas'];
    /*
    copyDatabaseFile('Eco.db').then(function () {
      // success! :)
      var db = sqlitePlugin.openDatabase('Eco.db');
      db.readTransaction(function (txn) {
        txn.executeSql('SELECT * FROM drug', [], function (tx, res) {
          console.log('Successfully read from pre-populated DB:');
          //for (var j=0; j < res.rows.length - 1; j++) {
          console.log(JSON.stringify(res.rows.length));
          console.log(JSON.stringify(res.rows.item(0)));
          //}
        });
      });
    }).catch(function (err) {
      // error! :(
      console.log(err);
    });
    */

    $scope.open = function (event,phonenumber) {
        if (phonenumber != undefined)
        {
            var urlTemplate = "templates/authentication/confirmdialog.html";
            var modalInstance = $uibModal.open({
                templateUrl: urlTemplate,
                controller: 'continueconfirmController',
                resolve: {
                    phonenumber: function () {
                        return phonenumber;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                 $log.info(selectedItem);
                 alert(phonenumber);
                 var poolData = JSON.parse(window.sessionStorage.getItem('poolData'));
                 var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

                  var attributeList = [];

                  var dataEmail = {
                      Name : 'email',
                      Value : 'email@mydomain.com'
                  };

                  var dataPhoneNumber = {
                      Name : 'phone_number',
                      Value : '+841238165126'
                  };

                  var dataPicture = {
                      Name : 'picture',
                      Value : 'hinhanh'
                  };

                  var dataGender = {
                      Name : 'gender',
                      Value : 'M'
                  };

                  var dataName = {
                      Name : 'name',
                      Value : 'do thien phuc'
                  };

                  var dataBirthdate = {
                      Name : 'birthdate',
                      Value : '17/08/1992'
                  };

                  var dataAddress = {
                      Name : 'address',
                      Value : '96 Cao Thang'
                  };


                  var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
                  var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);
                  var attributePicture = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPicture);
                  var attributeGender = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataGender);
                  var attributeName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataName);
                  var attributeBirthdate = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataBirthdate);
                  var attributeAddress = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataAddress);

                  attributeList.push(attributeEmail);
                  attributeList.push(attributePhoneNumber);
                  attributeList.push(attributePicture);
                  attributeList.push(attributeGender);
                  attributeList.push(attributeName);
                  attributeList.push(attributeBirthdate);
                  attributeList.push(attributeAddress);

                  userPool.signUp('+841238165126', '1234@Abcd', attributeList, null, function(err, result){
                      if (err && err.code != 'UsernameExistsException') {
                          console.log(err.code);
                          alert(err);
                          return;
                      }

                      var userData = {
                          Username : '+841238165126',
                          Pool : userPool
                      };

                      var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

                      //Neu da ton tai thi gui lai ma xac nhan
                      if (err && err.code == 'UsernameExistsException')
                      {
                        console.log('resend');
                        cognitoUser.resendConfirmationCode(function(err, result) {
                            if (err) {
                                alert(err);
                                return;
                            }
                            console.log('call result: ' + result.code);
                        });
                        return;
                      }
                      else {
                        //cognitoUser = result.user;
                        //console.log('user name is ' + cognitoUser.getUsername());
                        //confirmation
                        cognitoUser.confirmRegistration('123456', true, function(err, result) {
                            if (err) {
                                alert(err);
                                return;
                            }
                            console.log('call result: ' + result);
                        });
                      }

                  });
                 $state.go("confirmation",{"phonenumber":phonenumber});
            }, function (err) {
                 $log.info('Modal dismissed at: ' + err);
            });

            if (event != null)
            {
              event.preventDefault();
            }

        }
        else
        {

        }

    };
    //$location.path("/home");

}])

.controller('confirmationController',['$scope', '$state','$stateParams', function($scope,$state,$stateParams){
    $scope.phonenumber = $stateParams.phonenumber
    $scope.confirm = function () {
        //$location.path("/home");

        var poolData = JSON.parse(window.sessionStorage.getItem('poolData'));
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

        var userData = {
            Username : '+841238165126',
            Pool : userPool
        };

        var authenticationData = {
            Username : '+841238165126', // your username here
            Password : '1234@Abcd', // your password here
        };

        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.confirmRegistration($scope.confirmationCode, true, function(err, result) {
            if (err) {
                alert(err.code);
                return;
            }
            console.log('call result: ' + result);
            $state.go("home",{});
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
            },

            onFailure: function(err) {
                alert(err);
            },
            mfaRequired: function(codeDeliveryDetails) {
                var verificationCode = prompt('Please input verification code' ,'');
                cognitoUser.sendMFACode(verificationCode, this);
            }
        });

    };

    $scope.changedialog = function (event,phonenumber) {
        if (phonenumber != undefined)
        {

            var urlTemplate = "templates/authentication/continue2.html";
            var modalInstance = $uibModal.open({
                templateUrl: urlTemplate,
                controller: 'changephonedialogController',
                resolve: {
                }
            });

            modalInstance.result.then(function (selectedItem) {
                 $log.info(selectedItem);
            }, function (err) {
                 $log.info('Modal dismissed at: ' + err);
            });
        }
        else
        {

        }
        event.preventDefault();
    };
    //$location.path("/home");
}])

.controller('changephonedialogController',function($scope, $uibModalInstance) {
    //window.localStorage.setItem('lang', "vi");
    //changeLanguage(window.localStorage.getItem('lang'));
    $scope.close = function(){
        $uibModalInstance.dismiss('close');
    };
    $scope.ok = function(){
        $uibModalInstance.close('save');
    };

})

.controller('loginform', ['$cookies','$scope',function($cookies,$scope){
    $scope.login = function () {
        console.log($scope.checkboxModel);
        if ($scope.checkboxModel)
        {
            // Find tomorrow's date.
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);
            // Setting a cookie
            $cookies.put('loginuser',$scope.usermodel , {'expires': expireDate});
            $cookies.put('loginpassword',$scope.passwordmodel , {'expires': expireDate});
            console.log($scope.usermodel);
            console.log($scope.passwordmodel);
        }
        else{
            // Remove a cookie
            $cookies.remove('loginuser');
            $cookies.remove('loginpassword');
        }


    };
    //window.sessionStorage.setItem('test','23456');
    //console.log(window.sessionStorage.getItem('test'));
    //console.log(angular.element('#Text1').attr('href'));
}])

.controller('login1Controller', function($scope){
    //console.log(angular.element('#Text1').attr('href'));
    /*
    AWSCognito.config.region = 'ap-southeast-1';
    var poolData = {
        UserPoolId : 'ap-southeast-1_GHtcgvKBB', // your user pool id here
        ClientId : '18sch5r1558oh7srujgummti2j' // your app client id here
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : '', // your username here
        Pool : userPool
    };
    */
})

.controller('registerController', function($scope){
    $scope.formAllGood = function () {
        return ($scope.usernameGood && $scope.passwordGood && $scope.passwordCGood);
    };

    $scope.register = function () {
        console.log('register');
    };

    var attributeList = [];
    //address
    var dataAddress = {
        Name : 'address',
        Value : angular.element('#dataAddress').val()
    };
    var attributeAddress =
    new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataAddress);
    //birthdate
    var dataBirthdate = {
        Name : 'birthdate',
        Value : angular.element('#dataBirthdate').val()
    };
    var attributeBirthdate =
    new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataBirthdate);
    //email
    var dataEmail = {
        Name : 'email',
        Value : angular.element('#dataEmail').val()
    };
    var attributeEmail =
    new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
    //gender - M/F
    var dataGender = {
        Name : 'gender',
        Value : angular.element('#dataGender').val()
    };
    var attributeGender =
    new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataGender);
    //name
    var dataName = {
        Name : 'name',
        Value : angular.element('#dataName').val()
    };
    var attributeName =
    new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataName);
    //picture
    var dataPicture = {
        Name : 'picture',
        Value : angular.element('#dataPicture').val()
    };
    var attributePicture =
    new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPicture);
    //phone_number
    var dataPhoneNumber = {
        Name : 'phone_number',
        Value : angular.element('#dataPhoneNumber').val() // your phone number here with +country code and no delimiters in front
    };
    var attributePhoneNumber =
    new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);


    attributeList.push(attributeAddress);
    attributeList.push(attributeBirthdate);
    attributeList.push(attributeEmail);
    attributeList.push(attributeGender);
    attributeList.push(attributeName);
    attributeList.push(attributePicture);
    attributeList.push(attributePhoneNumber);

    var cognitoUser;
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(JSON.parse(window.sessionStorage.getItem('poolData')));
    /*
    userPool.signUp(angular.element('#dataUsername').val(), angular.element('#dataPassword').val(), attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        //upload photo to S3
    });

    */
})

.controller('confirmController', function($scope){
    cognitoUser.confirmRegistration(angular.element('#dataCode').val(), true, function(err, result) {
       if (err) {
           alert(err);
           return;
       }
       console.log('call result: ' + result);
    });
})

.controller('forgotController', function($scope){
    //console.log(angular.element('#Text1').attr('href'));
    /*
    AWSCognito.config.region = 'ap-southeast-1';
    var poolData = {
        UserPoolId : 'ap-southeast-1_GHtcgvKBB', // your user pool id here
        ClientId : '18sch5r1558oh7srujgummti2j' // your app client id here
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : '', // your username here
        Pool : userPool
    };
    */
})

.controller('scotchController', function($scope) {

    $scope.hide_product = function () {
        /*
        var request = $http({
          method: "post",
          url: "/data/hideProduct.php",
          data: {
            product_code: $scope.product_code
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        request.success(function (data) {
        $scope.message = "Product Hidden: "+data;
        });
        */
    }


    $scope.message = 'test';

    $scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];

})
// Home Controller
.controller('homeController', ['$scope', '$state',  function($scope,$state) {
    //$state.go('login1');
    window.localStorage.setItem('lang', "en");
    changeLanguage(window.localStorage.getItem('lang'));
}])
// Home List Controller
.controller('homelistController', ['$scope', '$state',  function($scope) {
    $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
}])

.controller('ModalController',function($scope, $uibModalInstance, item2) {
    //window.localStorage.setItem('lang', "vi");
    //changeLanguage(window.localStorage.getItem('lang'));
    var curr = new Date();
    curr.setMonth(curr.getMonth() + item2.month);
    curr.setDate(curr.getDate() + item2.day);
    item2.standard = curr;
    item2.date = curr;
    $scope.item2 = item2;
    $scope.close = function(){
        $uibModalInstance.dismiss('close');
    };
    $scope.ok = function(){
        $uibModalInstance.close('save');
    };

})


.controller('continueconfirmController',function($scope, $uibModalInstance, phonenumber) {
    //window.localStorage.setItem('lang', "vi");
    //changeLanguage(window.localStorage.getItem('lang'));
    $scope.phonenumber = phonenumber;
    $scope.close = function(){
        $uibModalInstance.dismiss('close');
    };
    $scope.ok = function(){
        $uibModalInstance.close('save');
    };

})

.controller('scheduleController',['$scope','$uibModal','$log','$http',function($scope,$uibModal,$log,$http) {
    //Load Vaccines data
    //window.localStorage.setItem('lang', "vi");
    changeLanguage(window.localStorage.getItem('lang'));
    if (window.sessionStorage.getItem('vaccines') == null)
    {
        $http.get('vaccine.json').then(function (success) {
            $scope.vaccines = success.data.vaccines;
            $scope.vaccines.sort(function(a, b) {
                if (a.month == b.month)
                {
                    return a.day - b.day;
                }
                else
                {
                    return a.month - b.month;
                }
            })
            console.log($scope.vaccines);
            window.sessionStorage.setItem('vaccines',JSON.stringify($scope.vaccines));
            //Process data
            $scope.data = [];
            var group = [[],[],[],[],[]];
            var item = {};
            var oldMonth = -1;
            for (var i in $scope.vaccines) {
                if (oldMonth < 0)
                {
                    oldMonth = $scope.vaccines[i].month;
                    item = $scope.vaccines[i];
                    item.status = 1;
                    group[item.period - 1].push(item);
                }
                else
                {
                    if (oldMonth == $scope.vaccines[i].month)
                    {
                        item = $scope.vaccines[i];
                        item.status = 1;
                        group[item.period - 1].push(item);
                    }
                    else
                    {
                        $scope.data.push(group);
                        group = [[],[],[],[],[]];
                        oldMonth = $scope.vaccines[i].month;
                        item = $scope.vaccines[i];
                        item.status = 1;
                        group[item.period - 1].push(item);
                    }
                }

                //$scope.data.push($scope.vaccines[i]);
            }
            //console.log($scope.data);
        },function (error){
            console.log(error);
        });
    }
    else
    {
        $scope.vaccines = JSON.parse(window.sessionStorage.getItem('vaccines'));
        //Process data
        $scope.data = [];
        var group = [[],[],[],[],[]];
        var item = {};
        var oldMonth = -1;
        for (var i in $scope.vaccines) {
            if (oldMonth < 0)
            {
                oldMonth = $scope.vaccines[i].month;
                item = $scope.vaccines[i];
                item.status = 1;
                group[item.period - 1].push(item);
            }
            else
            {
                if (oldMonth == $scope.vaccines[i].month)
                {
                    item = $scope.vaccines[i];
                    item.status = 1;
                    group[item.period - 1].push(item);
                }
                else
                {
                    $scope.data.push(group);
                    group = [[],[],[],[],[]];
                    oldMonth = $scope.vaccines[i].month;
                    item = $scope.vaccines[i];
                    item.status = 1;
                    group[item.period - 1].push(item);
                }
            }

            //$scope.data.push($scope.vaccines[i]);
        }
        //console.log($scope.data);
    }
    var urlTemplate = "templates/scheduledialog.html";
    if(window.localStorage.getItem('lang') == 'vi')
    {
        urlTemplate = "templates/scheduledialogvi.html";
    }
    else if (window.localStorage.getItem('lang') == 'en')
    {
        urlTemplate = "templates/scheduledialog.html";
    }

    $scope.open = function (item) {
        var modalInstance = $uibModal.open({
            templateUrl: urlTemplate,
            controller: 'ModalController',
            resolve: {
                item2: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
             $log.info(selectedItem);
        }, function (err) {
             $log.info('Modal dismissed at: ' + err);
        });
    };


}])

.controller('myControl', ['$scope', '$state',  function($scope,$state) {

     $scope.$state = $state;

}])

.controller('testloginController', ['$scope', '$state',  function($scope,$state) {

     $scope.$state = $state;

     $scope.login = function () {
         //$location.path("/home");
         $state.go("confirmation",{});
     };
}])

.controller('DraggableEventsCtrl', function($scope, moment, alert, calendarConfig) {
    var redPri = '#d3280a';
    var redSecond = '#f2300e';
    var greenPri = '#18ce1b';
    var greenSecond = '#1df420';
    var yellowPri = '#d7db00';
    var yellowSecond = '#f0f404';
    $scope.hello = function () {
        console.log("Hello");
    };

    //Create events
    var events = [];
    var event = {};
    //Process Standard and date

    if (window.sessionStorage.getItem('vaccines') == null)
    {

    }
    else
    {
        $scope.vaccines = JSON.parse(window.sessionStorage.getItem('vaccines'));
    }
    console.log("Vaccines", $scope.vaccines);

    for (var i in $scope.vaccines)
    {
        var curr = new Date();
        var current = $scope.vaccines[i];
        var input = $scope.vaccines[i];
        curr.setMonth(curr.getMonth() + $scope.vaccines[i].month);
        curr.setDate(curr.getDate() + $scope.vaccines[i].day);
        $scope.vaccines[i].standard = curr;
        $scope.vaccines[i].date = curr;
        event = {};
        event.title = $scope.vaccines[i].name;
        var rand = Math.random() * 10 % 2;
        if (rand > 1)
        {
            event.color = { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
              primary: redPri, // the primary event color (should be darker than secondary)
              secondary: redSecond // the secondary event color (should be lighter than primary)
            };
            event.draggable = false;
        }
        else
        {
            event.color = { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
              primary: greenPri, // the primary event color (should be darker than secondary)
              secondary: greenSecond // the secondary event color (should be lighter than primary)
            };
            event.draggable = true;
        }
        event.actions = [{ // an array of actions that will be displayed next to the event title
            label: '<i class="fa fa-pencil"></i>', // the label of the action
            cssClass: 'edit-action',
            current: current,
            // a CSS class that will be added to the action element so you can implement custom styling
            onClick: function(args) { // the action that occurs when it is clicked. The first argument will be an object containing the parent event
                console.log('Current',args.calendarEvent.actions[0]);
                $scope.open(args.calendarEvent.actions[0].current);
            }
        }];
        event.startsAt = curr;
        events.push(event);
    }

    console.log('Events',events);
    var vm = this;
    vm.events = events;
    /*
    vm.events = [
        {
            title: 'Draggable event',
            color: calendarConfig.colorTypes.warning,
            startsAt: moment().startOf('month').toDate(),
            draggable: true,
            actions: [{ // an array of actions that will be displayed next to the event title
                label: '<i class="fa fa-pencil"></i>', // the label of the action
                cssClass: 'edit-action',
                // a CSS class that will be added to the action element so you can implement custom styling
                onClick: function(args) { // the action that occurs when it is clicked. The first argument will be an object containing the parent event
                    $scope.open();
                    console.log($scope.data);
                }
            }]
        },
        {
            title: 'Non-draggable event',
            color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
              primary: redPri, // the primary event color (should be darker than secondary)
              secondary: redSecond // the secondary event color (should be lighter than primary)
            },
            //color: calendarConfig.colorTypes.info,
            startsAt: moment().startOf('month').toDate(),
            draggable: false
        },
        {
            title: 'Non-draggable event',
            color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
              primary: greenPri, // the primary event color (should be darker than secondary)
              secondary: greenSecond // the secondary event color (should be lighter than primary)
            },
            //color: calendarConfig.colorTypes.info,
            startsAt: moment().startOf('month').toDate(),
            draggable: false
        },
        {
            title: 'Non-draggable event',
            color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
              primary: yellowPri, // the primary event color (should be darker than secondary)
              secondary: yellowSecond // the secondary event color (should be lighter than primary)
            },
            //color: calendarConfig.colorTypes.info,
            startsAt: moment().startOf('month').toDate(),
            draggable: false
        }
    ];
    */

    vm.calendarView = 'month';
    vm.viewDate = moment().startOf('month').toDate();
    vm.cellIsOpen = true;

    vm.eventTimesChanged = function(event) {
        vm.viewDate = event.startsAt;
        //Change Standard Date - Occurred when changed date position
        //alert.show('Dragged and dropped', event);
    };

    vm.timespanClicked = function(date, cell) {

        if (vm.calendarView === 'month') {
          if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
            vm.cellIsOpen = false;
          } else {
            vm.cellIsOpen = true;
            vm.viewDate = date;
          }
        } else if (vm.calendarView === 'year') {
          if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
            vm.cellIsOpen = false;
          } else {
            vm.cellIsOpen = true;
            vm.viewDate = date;
          }
        }
    };

});
