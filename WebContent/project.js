function Project(id,name,description,site,author,fileSize,creationDate) {
  this.$id = id;
  this.name = name;
  this.description = description;
  this.site = site;
  this.author = author;
  this.fileSize = fileSize;
  this.creationDate = creationDate;
}

function Projects() {
  projects = [];
  this.projects = projects;
  this.loaded = 0;

  this.add = function(prj) {
    projects.splice(projects.length,0,prj);
  }

  this.get = function(id) {
    for(var i=0;i<projects.length;i++) {
      var prj = projects[i];
      if(prj.$id == id)
        return prj;
    }
  }

  this.remove = function(id) {
    for(var i=0;i<projects.length;i++) {
      if(projects[i].$id == id) {
        projects.splice(i,1);
        return;
      }
    }
  }

  this.update = function(itemOrId) {
    alert(itemOrId);
  }
}

angular.projects = new Projects();

angular.module('project',[]).
  factory('Projects', function() {
    return angular.projects;
  }).
  config(function($routeProvider) {
    $routeProvider.
    when('/', {controller:ListCtrl, templateUrl:'list.html'}).
    when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
    when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
    //when('/delete', {controller:DeleteCtrl, templateUrl:'detail.html'}).
    otherwise({redirectTo:'/'});
  }).filter('fileSize', function () {
		return function (size) {
			if (isNaN(size))
				size = 0;

			if (size < 1024)
				return size + ' Bytes';

			size /= 1024;

			if (size < 1024)
				return size.toFixed(2) + ' Kb';

			size /= 1024;

			if (size < 1024)
				return size.toFixed(2) + ' Mb';

			size /= 1024;

			if (size < 1024)
				return size.toFixed(2) + ' Gb';

			size /= 1024;

			return size.toFixed(2) + ' Tb';
		};
	});

     
function ListCtrl($scope, $http, Projects) {
  if(Projects.loaded == 0) {
    $http.get("projects.json").success(function(data) {
      for(var i = 0;i<data.length;i++) {
        var itm = data[i];
        Projects.add(new Project(itm.$id,itm.name,itm.description,itm.site,itm.author,itm.fileSize,itm.creationDate));
      }
    });
    Projects.loaded = 1;
  }
  $scope.projects = Projects;
  $scope.searchOn = function(param) {
	$scope.param = param;  
  };
  $scope.orderByParam = function(param) {
	$scope.customOrder = param;  
  };
}
     
function CreateCtrl($scope, $location, $timeout, Projects) {
  $scope.project = new Project();
  $scope.save = function() {
    $scope.project.$id = randomString(5,"abcdefghijklmnopqrstuvwxyz0123456789");
    Projects.add(angular.copy($scope.project));
    $location.path('/');
  }
}

function EditCtrl($scope, $location, $routeParams, Projects) {
   $scope.project = angular.copy(Projects.get($routeParams.projectId));
  console.log($routeParams.projectId);


   $scope.isClean = function() {
      return angular.equals(Projects.get($routeParams.projectId), $scope.project);
   }
   $scope.destroy = function() {
      Projects.remove($routeParams.projectId);
      $location.path('/');
   };
   $scope.save = function() {
      var prj = Projects.get($routeParams.projectId);
      prj.name = $scope.project.name;
      prj.description = $scope.project.description;
      prj.site = $scope.project.site;
      $location.path('/');
   };
}

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) 
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}
