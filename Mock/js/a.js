
var getTestDataFromJs = function(){
  $.ajax({
    url: 'api/dynamic/time',
    type: 'GET',
    dataType: 'json',
    // data: {param1: 'value1'},
  })
  .done(function(res) {
    console.log("success");
    // console.log(res);
    console.log(res.data.uname+">>"+res.data.uid);
  })
  .fail(function(res) {
    console.log("error");
  })
  .always(function(res) {
    console.log("complete");
  });
  
}

getTestDataFromJs();