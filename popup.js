$(document).on('DOMContentLoaded', function() {
  $('#get-rate-button').on('click', function() {
    $.ajax({
      url: "https://apiv2.bitcoinaverage.com/convert/global?from=BTC&to=USD&amount=1",
      method: 'get',
      success: (response) => { 
        $('.button').text("$" + response.price.toFixed(2));
        $('.button').attr('disabled', 'disabled');
      }
    });
  });
});
