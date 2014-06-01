participantModule.controller('assessmentController', ['$scope','$http','$routeParams','$log', function($scope,$http,$routeParams,$log) {
    $scope.initApp=function(){
        console.log('assessment initialized');
        $scope.formInfo = {};
        console.log('test');

    };

    $scope.saveAssessment= function(req){
        console.log('start save asm');
        console.log($scope.formInfo);
        console.log($('#form1'));
    };

    var form=
    { 'First Name': 'lalit',
        'Last Name': 'bhatia',
        meals_num1: [ '? undefined:undefined ?', '0' ],
        meals_num2: [ '0', '1' ],
        meals_num3: [ '0', '1' ],
        eating_patterns: 'on',
        meals_out1: '0',
        meals_out2: '0',
        meals_out3: '0',
        meals_out4: '0',
        food_type: [ '', '', '', '', '', '', '' ],
        act_devices: '',
        'current-weight': '',
        lowest_weight: '',
        diet_loss: '',
        loss_approach: '',
        coach_benefit: '',
        loss_benefit: '',
        spend_your_day: '',
        five_foods1: '',
        five_foods2: '',
        five_foods3: '',
        five_foods4: '',
        five_foods5: '',
        allergies: [ '', '' ],
        hard_to_lose: '',
        mantra: '',
        'tel-number': [ '', '' ],
        coach_msg: '' }
}]);

