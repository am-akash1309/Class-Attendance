const myapp = angular.module("myapp",['ui.router'])

var user = []

myapp.controller("bot1", function($scope, $state, $http, $document){
    $scope.dates = []
    $scope.homePagePreloder = false

    $http({
        method:"GET",
        url:"https://attendance-myclass.glitch.me/get_all"
    }).then (function(result){
        $scope.dates = result.data
        $scope.homePagePreloder = true
    })

    $scope.getLength = function (arra) {
        if (typeof arra[0]=="number"){
            return arra.length
        }
        else{
            return 0
        }
    }

    $scope.gotoadd = () => {
        $state.go("update")
    }
})

myapp.controller("bot2", function($scope, $state, $http, $document){
   
})

myapp.controller("bot3", function($scope, $state, $http, $document){
    // if (user.length==0 || user[0].name==undefined) {
    //     $state.go("login")
    // }
    $scope.updatePagePreloader_Submit = false
    $document.ready(function() {
        var elems = document.querySelectorAll('.datepicker');
        var today = new Date();
        var defaultDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        var instances = M.Datepicker.init(elems, {
            format: 'mmm d, yyyy  ddd',
            maxDate: today,
            defaultDate: defaultDate,
            setDefaultDate: true
        });

        var elems = document.querySelectorAll('.dropdown-trigger');
        var instances = M.Dropdown.init(elems);

        $scope.getexcisting()

    });

    function stringtoarray(){
        let inputString  = $scope.absentees
        const check = /\d/.test(inputString)
        if (!check){
            $scope.absentees=[inputString]
        }
        else {
        const stringWithoutSpaces = inputString.replace(/\s/g, '')
        const stringArray = stringWithoutSpaces.split(',')
        const numberArray = stringArray.map(Number)
        numberArray.sort((a, b) => a - b)
        $scope.absentees = numberArray
        }
    }

    $scope.assignCpBasedOnTime = () => {
        // Get the current time
        var currentTime = new Date();
            
        // Extract the hours and minutes from the current time
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
            
        // Convert the time to a numerical representation in the format HH.MM
        var timeInDecimal = parseFloat(hours + "." + (minutes < 10 ? "0" : "") + minutes);
            
        // Assign cp based on the time range
        if (timeInDecimal >= 8.45 && timeInDecimal < 9.35) {
           $scope.cp = 1;
        } else if (timeInDecimal >= 9.35 && timeInDecimal < 10.45) {
           $scope.cp = 2;
        } else if (timeInDecimal >= 10.45 && timeInDecimal < 11.35) {
           $scope.cp = 3;
        } else if (timeInDecimal >= 11.35 && timeInDecimal < 13.10) {
           $scope.cp = 4;
        } else if (timeInDecimal >= 13.10 && timeInDecimal < 14.00) {
           $scope.cp = 5;
        } else if (timeInDecimal >= 14.00 && timeInDecimal < 15.00) {
           $scope.cp = 6;
        } else if (timeInDecimal >= 15.00 && timeInDecimal < 15.50) {
           $scope.cp = 7;
        } else if (timeInDecimal >= 15.50 && timeInDecimal < 16.40) {
           $scope.cp = 8;
        } else if ((timeInDecimal >= 0 && timeInDecimal < 8.45) || (timeInDecimal >= 16.40 && timeInDecimal <= 23.59)) {
           $scope.cp = 8;
        }
    }
      
    $scope.submit = () => {
        $scope.updatePagePreloader_Submit = false
        if ($scope.absentees==undefined || $scope.absentees=='' || $scope.absentees==0){
            $scope.updatePagePreloader_Submit = true
            M.toast({
                "html": "Please enter the Absentees",
                "classes": "red rounded"
            })
        }
        else {
        stringtoarray()
        $http({
            method: "POST",
            url:"https://attendance-myclass.glitch.me/add_absentees",
            data: {
                "date": $scope.date,
                "period_num": $scope.cp,
                "absentees": $scope.absentees
            }
        }).then (function (result){
            $scope.updatePagePreloader_Submit = true
            if (result.data.status=="ok"){
                M.toast({
                    "html": "Absentees Updated",
                    "classes": "green rounded"
                })
            }
        })
        }
    }

    $scope.getexcisting = () => {
        $scope.updatePagePreloader_Submit = false
        $http({
            method: "POST",
            url:"https://attendance-myclass.glitch.me/get_one",
            data: {
                "date": $scope.date
            }
        }).then (function (result){
            if (result.data.status=="Null"){
                $scope.absentees=undefined
            }
            else if (result.data[$scope.cp]==undefined){
                $scope.absentees=undefined
            }
            else{
                $scope.absentees=result.data[$scope.cp]
            }
            $scope.updatePagePreloader_Submit = true
        })
    }

    $scope.changeperiod = (num) => {
        $scope.cp = num
        $scope.getexcisting()
    }

    $scope.gotohome = () => {
        $state.go("main")
    }
})

myapp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state("main",{
        url: "/",
        templateUrl:"./home.html",
        controller: "bot1"
    })
    .state("login", {
        url:"/Login",
        templateUrl:"./login.html",
        controller: "bot2"
    })
    .state("update", {
        url: "/Update",
        templateUrl: "./update.html",
        controller: "bot3"
    })
    $urlRouterProvider.otherwise("/")
})