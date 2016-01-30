app.controller('ccTableCtrl', ['$scope', 'ccFactory', function ($scope, ccFactory){
  $scope.editForm = false;
  $scope.newTag = '';

  ccFactory.getTable().then(function(data){
    $scope.cues = data;
  });

  //var eventList = ret.map(function(elem){
  //  return elem.tags.map(function(tag){
  //    return {'text':tag};
  //  })
  //});

  //id: event.id,
  //  htmlLink: event.htmlLink,
  //  summary: event.summary,
  //  description: event.description,
  //  location: event.location,
  //  startDate: event.start.date,
  //  endDate: event.end.date

  //$scope.cues = [
  //  {
  //    summary: 'valentines Day',
  //    status: 'pending',
  //    startDate:  new Date(2016, 1, 14),
  //    endDate:  new Date(2016, 1, 14),
  //    tags: [{text: 'chocolate'}, {text: 'love'}, {text: 'couples'}],
  //    description: 'A day where couples show their affection publicly'
  //  }, {
  //    summary: 'valentines Day',
  //    status: 'pending',
  //    startDate:  new Date(2016, 1, 14),
  //    endDate:  new Date(2016, 1, 14),
  //    tags: [{text: 'chocolate'}, {text: 'love'}, {text: 'couples'}],
  //    description: 'A day where couples show their affection publicly'
  //  },    {
  //    summary: 'valentines Day',
  //    status: 'pending',
  //    startDate:  new Date(2016, 1, 14),
  //    endDate:  new Date(2016, 1, 14),
  //    tags: [{text: 'chocolate'}, {text: 'love'}, {text: 'couples'}],
  //    description: 'A day where couples show their affection publicly'
  //  },    {
  //    summary: 'valentines Day',
  //    status: 'pending',
  //    startDate:  new Date(2016, 1, 14),
  //    endDate:  new Date(2016, 1, 14),
  //    tags: [{text: 'chocolate'}, {text: 'love'}, {text: 'couples'}],
  //    description: 'A day where couples show their affection publicly'
  //  }
  //];

  //ccFactory.getTags().then(function(data){
  //   $scope.tags = data;
  //});

  $scope.cues = [
    {
      name: 'valentines Day',
      status: 'pending',
      startDate:  new Date(2016, 1, 14),
      endDate:  new Date(2016, 1, 14),
      tags: [{text: 'chocolate'}, {text: 'love'}, {text: 'couples'}],
      description: 'A day where couples show their affection publicly'
    }, {
      name: 'valentines Day',
      status: 'pending',
      startDate:  new Date(2016, 1, 14),
      endDate:  new Date(2016, 1, 14),
      tags: [{text: 'chocolate'}, {text: 'love'}, {text: 'couples'}],
      description: 'A day where couples show their affection publicly'
    },    {
      name: 'valentines Day',
      status: 'pending',
      startDate:  new Date(2016, 1, 14),
      endDate:  new Date(2016, 1, 14),
      tags: [{text: 'chocolate'}, {text: 'love'}, {text: 'couples'}],
      description: 'A day where couples show their affection publicly'
    },    {
      name: 'valentines Day',
      status: 'pending',
      startDate:  new Date(2016, 1, 14),
      endDate:  new Date(2016, 1, 14),
      tags: [{text: 'chocolate'}, {text: 'love'}, {text: 'couples'}],
      description: 'A day where couples show their affection publicly'
    }
  ];

  $scope.openEdit = function(cue){
    $scope.currentCue = cue;
    $scope.editForm = ccFactory.toggle($scope.editForm);
  };

  $scope.addTag = function(newTag){
    console.log('my new tag:',newTag);
    $scope.currentCue.tags.push(newTag);
  };


}]);
