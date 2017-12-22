(function () {
  'use strict';

  /* Sandbox script */

  /* initialization stuff */
  // setup ttb SDK
  var ttb = new TTB({
    partnerKey: '1-7a32b4f2-62a8-4990-830b-2cf674504875', // official TTB - retrieve yours from support team.
    vertical: 'direct',
    onSessionExpire: onSessionExpire,
    debug: true
  });

  // to be invoked when google maps library gets successfully loaded
  window.googleInit = function () {

    /* -- searchBySiteAddress | googleBuildAddress - init stuff - starts -- */
    // render the autocomplete component instance on the desired location
    var autocompleteElement = document.getElementById('googleBuildAddress__autocomplete');
    var autocomplete = new google.maps.places.Autocomplete(autocompleteElement, {types: ['geocode']});

    // when the user selects an address from the drop-down, populate the address fields in the form.
    autocomplete.addListener('place_changed', function () {

      // fill the address form fields
      ttb.googleBuildAddress(autocomplete, {autoFillContext: '#searchBySiteAddress__form'});

      // auto fetch the matching record
      setTimeout(function () {
        window.searchBySiteAddress();
      });

    });
    /* -- searchBySiteAddress | googleBuildAddress - init stuff - ends -- */

  };

  /* util functions */

  // to be invoked when the session is expired
  function onSessionExpire(info) {
    console.log('onSessionExpire', info);

    // show the logged-in status bar
    updateLoginStatus('WARNING', 'NO or EXPIRED SESSION - Please log in to resume using App.');

    // auto-focus on the pass field.
    $('#login__password').focus();
  }

  // updates the login alert message for success, failure, or warning.
  function updateLoginStatus(type, message) {
    var classes = {
      SUCCESS: 'alert alert-success',
      ERROR: 'alert alert-danger',
      WARNING: 'alert alert-warning'
    };

    $('#logged-in')
      .attr('class', classes[type])
      .text(message)
      .slideDown();
  }

  /* authentication functions */
  window.login = function () {
    console.log('login clicked');

    var payload = {
      TbUser: {
        username: $('[name="login__username"]').val(),
        password: $('[name="login__password"]').val()
      }
    };

    return ttb.login(payload)
      .done(function (res) {
        if (res.response.status === 'OK') {
          // user is successfully logged-in !!
          // your success code here to consume res.response.data for logged-in user info
          alert('login response - ' + JSON.stringify(res.response.data));

          // empty the password field
          //$('[name="login__password"]').val('');

          // show the logged-in status bar
          updateLoginStatus('SUCCESS', 'Logged in successfully !');

        } else {
          // your failure code here to consume res.response.data for validation errors info
          alert('login response - ' + JSON.stringify(res));

          // show the logged-in status bar
          updateLoginStatus('ERROR', res.response.data[0] || 'Login Failed. Please review credentials.');
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('login response - ' + JSON.stringify(err));

        // show the logged-in status bar
        updateLoginStatus('ERROR', 'Could not connect to server. Please try again later.');

      });
  };

  window.logout = function () {
    console.log('logout clicked');

    return ttb.logout()
      .done(function (res) {
        if (res.response.status === 'OK') {
          // user is successfully logged-out!!
          // your success code here to clear any cached info etc from the web page
          alert('logout response - ' + JSON.stringify(res.response.data));

          // hide the logged-in status bar
          updateLoginStatus('WARNING', 'You are Logged out - Please log back in to resume using App.');

        } else {
          // your failure code here to consume res.response.data
          console.log(res.response.data);
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('logout response - ' + JSON.stringify(err));
      });
  };

  /* UI Widgets */
  window.showSelectSponsor = function () {
    console.log('showSelectSponsor clicked');

    var payload = {
      email: 'agent47@domain.com',
      zipCode: '12345'
    };

    TTB.showSelectSponsor(payload, {
      ttb: ttb,
      onSelect: function (info) {
        // your success code here
        alert('showSelectSponsor select - ' + JSON.stringify(info));
      },
      onError: function (reason) {
        // your failure code here
        alert('showSelectSponsor error - ' + JSON.stringify(reason));
      }
    });
  };


  /* web-services APIs */
  window.getSearchFields = function () {
    console.log('getSearchFields clicked');

    ttb.getSearchFields()
      .done(function (res) {
        if (res instanceof Array) {

          // your success code here to consume res as fields list.
          console.log(res);

          alert('getSearchFields response - ' + JSON.stringify(res));
        } else {
          // your failure code here to consume res.response.data
          alert('getSearchFields response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('getSearchFields response - ' + JSON.stringify(err));
      });
  };

  window.getTypesReport = function () {
    console.log('getTypesReport clicked');

    ttb.getTypesReport()
      .done(function (res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('getTypesReport response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('getTypesReport response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('getTypesReport response - ' + JSON.stringify(err));
      });
  };

  window.globalSearch = function () {
    console.log('globalSearch clicked');

    var params = {limit: 1000, page: 2};
    var payload = {
      "mm_fips_state_code": "06", // State FIPS
      "mm_fips_muni_code": "059", // County FIPS
      "sa_site_city": [ // Cities
        "ANAHEIM"
      ],
      "sa_site_zip": [ // Zip Codes
        "92801",
        "92805"
      ],
      "sa_site_mail_same": "Y",
      "sa_owner_1_type": "0",
      "sa_nbr_bedrms": { // Beds
        "match": "<=",
        "value": 3
      },
      "sa_nbr_bath": { // Baths
        "match": "<=",
        "value": 2
      },
      "use_code_std": [
        "RSFR",
        "RCON"
      ],
      "sa_yr_blt": { // Year built
        "match": "From-To",
        "value": {
          "from": 1950,
          "to": 2002
        }
      },
      "sa_assr_year": {
        "match": ">",
        "value": 2000
      },
      "searchOptions": { // Additional Search Options
        "omit_saved_records": false
      },
      "customFilters": { // Filters
        "is_site_number_even_search": "Y"
      }
    };

    ttb.globalSearch(payload, params)
      .done(function (res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('globalSearch response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('globalSearch response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('globalSearch response - ' + JSON.stringify(err));
      });
  };

  window.globalSearchCount = function () {
    console.log('globalSearchCount clicked');

    var params = {limit: 1000, page: 2};
    var payload = {
      "mm_fips_state_code": "06", // State FIPS
      "mm_fips_muni_code": "059", // County FIPS
      "sa_site_city": [ // Cities
        "ANAHEIM"
      ],
      "sa_site_zip": [ // Zip Codes
        "92801",
        "92805"
      ],
      "sa_nbr_bedrms": { // Beds
        "match": "<=",
        "value": 3
      },
      "searchOptions": { // Additional Search Options
        "omit_saved_records": false
      },
      "customFilters": { // Filters
        "is_site_number_even_search": "Y"
      }
    };

    ttb.globalSearchCount(payload, params)
      .done(function (res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('globalSearchCount response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('globalSearchCount response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('globalSearchCount response - ' + JSON.stringify(err));
      });
  };

  window.orderReport = function () {
    console.log('orderReport clicked');

    var payload = {
      sa_property_id: "0039025849",
      state_county_fips: "06059",
      report_type: "property_profile",
      output: "link"
    };

    ttb.orderReport(payload)
      .done(function (res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('orderReport response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('orderReport response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('orderReport response - ' + JSON.stringify(err));
      });
  };

  window.propertyComps = function () {
    console.log('propertyComps clicked');

    var payload = {
      "sa_property_id": "0039025849",
      "mm_fips_state_code": "06",
      "date_transfer(+/-)": 12,
      "distance_in_km": 1.6,
      "nbr_bath(+/-)": 1,
      "nbr_bedrms(+/-)": 1,
      "sqft(+/-)": 0.2,
      "yr_blt(+/-)": 20
    };

    ttb.propertyComps(payload)
      .done(function (res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('propertyComps response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('propertyComps response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('propertyComps response - ' + JSON.stringify(err));
      });
  };

  window.propertyDetails = function () {
    console.log('propertyDetails clicked');

    var payload = {
      property_id: $('[name="propertyDetails__property_id"]').val(),
      state_fips: $('[name="propertyDetails__state_fips"]').val()
    };

    var options = {
      autoFillContext: '#propertyDetails__form'
    };

    ttb.propertyDetails(payload, options)
      .done(function (res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('propertyDetails response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('propertyDetails response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('propertyDetails response - ' + JSON.stringify(err));
      });
  };

  window.searchByOwnerName = function () {
    console.log('searchByOwnerName clicked');

    var payload = {
      first_name: "Fariba",
      last_name: "Siddiqi",
      state_county_fips: "06059"
    };

    ttb.searchByOwnerName(payload)
      .done(function (res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('searchByOwnerName response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('searchByOwnerName response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('searchByOwnerName response - ' + JSON.stringify(err));
      });
  };

  window.searchByParcelNumber = function () {
    console.log('searchByOwnerName clicked');

    var payload = {
      parcel_number: "46327216",
      state_county_fips: "06059"
    };

    ttb.searchByParcelNumber(payload)
      .done(function (res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('searchByParcelNumber response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('searchByParcelNumber response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('searchByParcelNumber response - ' + JSON.stringify(err));
      });
  };

  window.searchBySiteAddress = function () {
    console.log('searchBySiteAddress clicked');

    var payload = {
      site_street_number: $('[name="propertyDetails__site_street_number"]').val(),
      site_route: $('[name="propertyDetails__site_route"]').val(),
      site_city: $('[name="propertyDetails__site_city"]').val(),
      site_state: $('[name="propertyDetails__site_state"]').val(),
      site_zip: $('[name="propertyDetails__site_zip"]').val(),
      site_unit: $('[name="propertyDetails__site_unit"]').val(),
      site_county: $('[name="propertyDetails__site_county"]').val()
    };

    // build the "site_address" field
    payload.site_address = payload.site_street_number + ' ' + payload.site_route;

    ttb.searchBySiteAddress(payload)
      .done(function (res) {
        if (res.response.status === 'OK') {
          // your success code here to consume res.response.data
          alert('searchBySiteAddress response - ' + JSON.stringify(res.response.data));
        } else {
          // your failure code here to consume res.response.data
          alert('searchBySiteAddress response - ' + JSON.stringify(res));
        }
      })
      .fail(function (err) {
        // your failure code here
        alert('searchBySiteAddress response - ' + JSON.stringify(err));
      });
  };

})();
