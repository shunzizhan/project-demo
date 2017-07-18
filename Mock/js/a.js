
var getTestDataFromJs = function(){
  $.ajax({
    url: '/api/dynamic/time',
    type: 'GET',
    dataType: 'text',
    // data: {param1: 'value1'},
  })
  .done(function(res) {
    console.log(res);
    console.log(res);
    // console.log(res.data.uname+">>"+res.data.uid);
  })
  .fail(function(res) {
    console.log(res);
  })
  .always(function(res) {
    console.log(res);
  });
  
}
getTestDataFromJs();