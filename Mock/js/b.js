// __inline('a.js');

var getTestData = function(){
  $.ajax({
    url: '/api/user',
    type: 'GET',
    dataType: 'json',
    // data: {param1: 'value1'},
  })
  .done(function(res) {
    console.log("success");
    console.log(res.data.uname+">>"+res.data.uid);
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
  
}

getTestData();