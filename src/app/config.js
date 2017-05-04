export function configRoutes($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      template: '<dj-login></dj-login>'
    })
    .when('/player', {
      template: '<dj-now-playing></dj-now-playing>'
    })
    .when('/user', {
      template: '<dj-user></dj-user>'
    })
    .when('/settings', {
      template: '<dj-settings></dj-settings>'
    });

    $locationProvider.html5Mode(true);
}