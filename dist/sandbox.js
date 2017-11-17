
(function () {
  'use strict';

  /* Sandbox script */

  // setup ttb SDK
  var ttb = new TTB({
    partnerKey: '1-7a32b4f2-62a8-4990-830b-2cf674504875', // official TTB - retrieve yours from support team.
    baseURL: 'https://direct.api.titletoolbox.com/',
    debug: true
  });


  window.login = function () {
    console.log('login clicked');

    var payload = {
      TbUser: {
        username: $('[name="login__username"]').val(),
        password: $('[name="login__password"]').val()
      }
    };

    ttb.login(payload)
      .done(function(res) {
        if (res.response.status === 'OK') {
          // user is successfully logged-in !!
          // your success code here to consume res.response.data for logged-in user info
          alert('login response - ' + JSON.stringify(res.response.data));

          // empty the password field
          $('[name="login__password"]').val('');

          // show the logged-in status bar
          $('#logged-in').slideDown();

        } else {
          // your failure code here to consume res.response.data for validation errors info
          alert('login response - ' + JSON.stringify(res));
        }
      })
      .fail(function(err) {
        // your failure code here
        alert('login response - ' + JSON.stringify(err));
      });
  };

  window.logout = function () {
    console.log('logout clicked');

    ttb.logout()
      .done(function(res) {
        if (res.response.status === 'OK') {
          // user is successfully logged-out!!
          // your success code here to clear any cached info etc from the web page
          alert('logout response - ' + JSON.stringify(res.response.data));

          // hide the logged-in status bar
          $('#logged-in').hide();
        } else {
          // your failure code here to consume res.response.data
          console.log(res.response.data);
        }
      })
      .fail(function(err) {
        // your failure code here
        alert('logout response - ' + JSON.stringify(err));
      });
  };

  window.getSearchFields = function () {
    console.log('getSearchFields clicked');

    ttb.getSearchFields()
      .done(function(res) {
        if (res instanceof Array) {
          if (res instanceof Array) {
            // your success code here to consume res as fields list.
            console.log(res);
          } else {
            // your failure code here to consume res
            console.log(res);
          }
          alert('getSearchFields response - ' + JSON.stringify(res));
        } else {
          // your failure code here to consume res.response.data
          alert('getSearchFields response - ' + JSON.stringify(res));
        }
      })
      .fail(function(err) {
        // your failure code here
        alert('getSearchFields response - ' + JSON.stringify(err));
      });
  };

  window.getTypesReport = function () {
    console.log('getTypesReport clicked');

    ttb.getTypesReport()
      .done(function(res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('getTypesReport response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('getTypesReport response - ' + JSON.stringify(res));
        }
      })
      .fail(function(err) {
        // your failure code here
        alert('getTypesReport response - ' + JSON.stringify(err));
      });
  };

})();
