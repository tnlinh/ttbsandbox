(function () {
  'use strict';

  var defaults;

  defaults = {
    partnerKey: '233457799',
    baseURL: 'https://direct.api.titletoolbox.com/',
    debug: false
  };

  /**
   * The main class for consuming TTB web services.
   * @class
   * @alias TTB
   *
   * @param {Object} config - The configuration info required
   * @param {String} config.partnerKey - The Partner-Key is a unique ID assigned to your account to be sent on every request.
   * @param {String} [config.baseURL="https://direct.api.titletoolbox.com/"] - The Base URL to be used for APIs calls
   * @param {String} [config.debug=true] - SDK debug mode flag useful for logs, etc.
   *
   * @return {Object} ttb - The instance associated with the provided configuration.
   *
   *  @example
   *  // With basic and minimum requirement.
   *  var ttb = new TTB({
   *    partnerKey: '{your partner key}',
   *  });
   *
   *  @example
   *  // With advanced configuration for custom URL, and logs for debug mode.
   *  var ttb = new TTB({
   *    partnerKey: '{your partner key}',
   *    baseURL: 'https://direct.api.titletoolbox.com/',
   *    debug: true
   *  });
   * */
  window.TTB = function (config) {

    /**
     * @type {Object}
     * @desc The configuration passed while instantiating main SDK class.
     * */
    this.config = config;

    // setup default baseURL
    this.config.baseURL = this.config.baseURL || defaults.baseURL;
    this.config.debug = this.config.debug || defaults.debug;

    this._log(['ttbsdk: ', 'TTB SDK instantiated.']);
  };

  /** @lends TTB.prototype */
  window.TTB.prototype = {

    /**
     * Logs the arguments based on debug flag.
     * @private
     * */
    _log: function (args) {
      this.config.debug && console.log.apply(console, args);
    },


    /**
     * Triggers the request with all required headers, cookies, etc.
     * @param options {Object} - The configuration to pass to $.ajax
     * @param endpoint {Object} - The endpoint of the webservices
     * @private
     *
     * */
    _ajax: function (options, endpoint) {
      var self, request;

      self = this;

      // take the full URL or build it up using baseURL and the given endpoint
      options.url = options.url || this.config.baseURL + endpoint;

      // extend given AJAX options with required Headers, and CORS flag
      request = $.extend(options, {

        // TTB Sandbox required headers
        headers: {
          'Partner-Key': this.config.partnerKey,
          'Third-Party': true
        },

        // allow CORS
        xhrFields: {
          withCredentials: true
        }
      });

      return $.ajax(request)
        .done(function (res) {

          if (typeof res === 'string' || res instanceof Array || res.response.status === 'OK') {
            self._log(['ttbsdk: ', endpoint, ' : success : ', res]);
          } else {
            self._log(['ttbsdk: ', endpoint, ' : fail : ', res]);
          }

          return res;
        })
        .fail(function (err) {
          self._log(['ttbsdk: ', endpoint, ' : error : ', err]);
          return err;
        });
        //.always(function(arg) {
        //  //self._log([endpoint, ' : always : ', arg]);
        //  return arg;
        //});
    },

    /**
     * This method is used to log the user in and maintain a session for the user throughout the App.
     *
     * @param {Object} payload - The payload object containing required info
     * @param {String} payload.username - the email/username used while signing up
     * @param {String} payload.password - the secret password of the account
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   TbUser: {
     *     username: "awesomeuser99@domain.com",
     *     password: "secret_Password0"
     *   }
     * };
     *
     * ttb.login(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // user is successfully logged-in !!
     *     // your success code here to consume res.response.data for logged-in user info
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data for validation errors info
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    login: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/login.json');
    },


    /**
     * Logs out from the TTB webservices server
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.logout()
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *    // user is successfully logged-out!!
     *    // your success code here to clear any cached info etc from the web page
     *    console.log(res.response.data);
     *
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    logout: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, 'webservices/logout.json');
    },


    /**
     * Search a property by APN.
     *
     * @param {Object} payload - The payload object containing required info
     * @param {String} payload.parcel_number - The Parcel Number against the property
     * @param {String} payload.state_county_fips - The State County FIPS against the property
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   parcel_number: "46327216",
     *   state_county_fips: "06059"
     * };
     *
     * ttb.searchByParcelNumber(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    searchByParcelNumber: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/search_parcel_number.json');
    },


    /**
     * Search a property by site address.
     *
     * @param {Object} payload - The payload object containing required info - (At least any of the following is required)
     * @param {string} [payload.site_address]
     * @param {string} [payload.site_unit]
     * @param {string} [payload.site_city]
     * @param {string} [payload.site_state]
     * @param {string} [payload.site_street_number]
     * @param {string} [payload.site_route]
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   site_address: "18721 Paseo Picasso",
     *   site_unit: "",
     *   site_city: "Irvine",
     *   site_state: "CA",
     *   site_zip:" 92603",
     *   site_street_number: "18721",
     *   site_route: "Paseo Picasso"
     * };
     *
     * ttb.searchBySiteAddress(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    searchBySiteAddress: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/search_property/ttb.json');
    },


    /**
     * Search a property by owners name.
     *
     * @param {Object} payload - The payload object containing required info - (At least any of the following is required)
     * @param {String} [payload.first_name] - Owner's First Name
     * @param {String} [payload.last_name] - Owner's Last Name
     * @param {String} [payload.state_county_fips] - State County FIPS of the property
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   first_name: "Fariba",
     *   last_name: "Siddiqi",
     *   state_county_fips: "06059"
     * };
     *
     * ttb.searchByOwnerName(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    searchByOwnerName: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/search_owner_name/ttb.json');
    },


    /**
     * This will allow you to order a report from the service. The available reports will depend on your account set up.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.sa_property_id - Unique ID of the property
     * @param {String} payload.state_county_fips - State FIPS of the property
     * @param {String} [payload.output="link"] - Format of output, supported types are "link", and "html".
     * @param {String} [payload.report_type="property_profile"] - The report type, supported types are "single_page_profile", "avm"(*), "prep"(*), "tax_bill" and "property_profile".
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   sa_property_id: "0039025849",
     *   state_county_fips: "06059"
     *   report_type: "property_profile",
     *   output: "link",
     * };
     *
     * ttb.orderReport(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    orderReport: function (payload) {

      // setup the defaults
      payload.output = payload.output || 'link';
      payload.report_type = payload.report_type || 'property_profile';

      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/order_report.json');
    },


    /**
     * This method is used to return a list of sales around a subject property PLUS offer a series of statistics based on the response results.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.sa_property_id - Unique ID of the property
     * @param {String} payload.mm_fips_state_code - State FIPS of the property
     * @param {Number} [payload.date_transfer(+/-)] - Sold
     * @param {Number} [payload.distance_in_km] - Distance (in kilometers)
     * @param {Number} [payload.nbr_bath(+/-)] - Baths
     * @param {Number} [payload.nbr_bedrms(+/-)] - Beds
     * @param {Number} [payload.sqft(+/-)] - SQFT
     * @param {Number} [payload.yr_blt(+/-)] - Year built
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   "sa_property_id": "0039025849",
     *   "mm_fips_state_code": "06",
     *   "date_transfer(+/-)": 12,
     *   "distance_in_km": 1.6,
     *   "nbr_bath(+/-)": 1,
     *   "nbr_bedrms(+/-)": 1,
     *   "sqft(+/-)": 0.2,
     *   "yr_blt(+/-)": 20
     * };
     *
     * ttb.propertyComps(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    propertyComps: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/property_comps.json');
    },


    /**
     * This method is used to pull details of a property specified by property_id
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {Number} payload.property_id - Unique ID of the property
     * @param {Number} payload.state_fips - State FIPS of the property
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *   property_id: 0091683346
     *   state_fips: 25,
     * };
     *
     * ttb.propertyDetails(payload)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    propertyDetails: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/property_details.json');
    },


    /**
     * This method is used to search all properties matching a set of criteria.<br>
     * There is a vast number of criteria available, see the Available Search Fields and Search Criteria section.
     *
     * @param {Object} payload - The payload object containing required info.
     * @param {String} payload.mm_fips_state_code - State FIPS of the property
     * @param {Object | String} [payload.FIELD_NAME] - Other search fields to be sent.

     * @param {Object} [payload.customFilters] - Filters fields are to be sent via this wrapper - See the available search fields for more.
     * @param {Object} [payload.customFilters.is_site_number_even_search] - A custom filter
     * @param {Object} [payload.customFilters.FIELD_NAME] - Other filter type search fields to be sent.

     * @param {Object} [payload.searchOptions] - Additional options to take control on records.
     * @param {String} [payload.searchOptions.max_limit] - Limit the matched records.
     * @param {String} [payload.searchOptions.omit_saved_records=false] - Suppress/Omit records already saved.
     *
     * @param {Object} [params] - The query string params limit and page on URL are used to control pagination of the result.
     * @param {String} [params.limit] - Determines how many recs to include in one page.
     * @param {String} [params.page] - Specifies the page number in the full result set.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var params = { limit: 1000, page: 2 };
     * var payload = {
     *  "mm_fips_state_code": "06", // State FIPS
     *  "mm_fips_muni_code": "059", // County FIPS
     *  "sa_site_city": [ // Cities
     *    "ANAHEIM"
     *  ],
     *  "sa_site_zip": [ // Zip Codes
     *    "92801",
     *    "92805"
     *  ],
     *  "sa_site_mail_same": "Y",
     *  "sa_owner_1_type": "0",
     *  "sa_nbr_bedrms": { // Beds
     *    "match": "<=",
     *    "value": 3
     *  },
     *  "sa_nbr_bath": { // Baths
     *    "match": "<=",
     *    "value": 2
     * },
     *  "use_code_std": [
     *    "RSFR",
     *    "RCON"
     * ],
     *  "sa_yr_blt": { // Year built
     *    "match": "From-To",
     *    "value": {
     *      "from": 1950,
     *      "to": 2002
     *    }
     * },
     *  "sa_assr_year": {
     *    "match": ">",
     *    "value": 2000
     * },
     *  "searchOptions": { // Additional Search Options
     *    "omit_saved_records": false
     * },
     *  "customFilters": { // Filters
     *    "is_site_number_even_search": "Y"
     *  }
     * };
     *
     * ttb.globalSearch(payload, params)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     * */
    globalSearch: function (payload, params) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      var endpoint = 'webservices/global_search.json' + (params && $.param(params));

      return this._ajax(request, endpoint);
    },


    /**
     * This method is to only get the count (as opposed to full set of records) against a certain set of search criteria.<br>
     * Note - It accepts the same search criteria input as for [global_search]{@link TTB#globalSearch} API.
     *
     * @param {Object} payload - The payload object containing required info.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * var payload = {
     *  "mm_fips_state_code": "06", // State FIPS
     *  "mm_fips_muni_code": "059", // County FIPS
     *  "sa_site_city": [ // Cities
     *    "ANAHEIM"
     *  ],
     *  "sa_site_zip": [ // Zip Codes
     *    "92801",
     *    "92805"
     *  ],
     *  "sa_nbr_bedrms": { // Beds
     *    "match": "<=",
     *    "value": 3
     *  },
     *  "searchOptions": { // Additional Search Options
     *    "omit_saved_records": false
     * },
     *  "customFilters": { // Filters
     *    "is_site_number_even_search": "Y"
     *  }
     * };
     *
     * ttb.globalSearchCount(payload, params)
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    globalSearchCount: function (payload) {
      var request = {
        method: 'POST',
        data: JSON.stringify(payload)
      };

      return this._ajax(request, 'webservices/get_search_count.json');
    },


    /**
     * This method will allow you to verify what reports are available to your user profile.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.getTypesReport()
     * .done(function(res) {
     *   if (res.response.status === 'OK') {
     *     // your success code here to consume res.response.data
     *     console.log(res.response.data);
     *   } else {
     *     // your failure code here to consume res.response.data
     *     console.log(res.response.data);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    getTypesReport: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, 'webservices/types_report.json');
    },


    /**
     * This method provides the complete list of all fields that can be used to construct search terms for
     * [global_search]{@link TTB#globalSearch} and [global_search_count]{@link TTB#globalSearchCount} APIs. <br><br>
     *
     * To view the complete list of all available search fields and their possible values. <br>
     * Please follow this [JSON presentation]{@link http://jsoneditoronline.org/?id=ba6b41ee73822c653dae0e2cc8cf6351} -
     * The key info you should look for is the <code>field_name</code>, <code>search_type</code> and <code>choices</code>.
     *
     * @example
     * var ttb = new TTB({ ... }); // skip if already instantiated.
     *
     * ttb.getSearchFields()
     * .done(function(res) {
     *   if (res instanceof Array) {
     *     // your success code here to consume res as fields list. see example [< JSON here >]{@link http://jsoneditoronline.org/?id=ba6b41ee73822c653dae0e2cc8cf6351}
     *     console.log(res);
     *   } else {
     *     // your failure code here to consume res
     *     console.log(res);
     *   }
     * })
     * .fail(function(err) {
     *   // your failure code here
     * })
     * .always(function() {
     *  // your on-complete code here as common for both success and failure
     * });
     *
     * @return {Object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
     *
     * */
    getSearchFields: function () {
      var request = {
        method: 'GET'
      };

      return this._ajax(request, 'webservices/get_search_fields.json');
    }

  };

})();