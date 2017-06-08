function generateRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

function requestAuthorization() {
  var state = generateRandomString(16);
  $.ajax({
    url: '/requestSpotAuthorization',
    success: function(res) {
      console.log('successfully requested authorization');
      console.log(res);
    },
    error: function(err) {
      console.log('failed to request authorization');
      console.log(err);
    }
  })
}