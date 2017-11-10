'use strict';

/**
 * This is description
 * @class
 * @param {object} config - The configuration info required
 * @param {string} config.baseURL - The Base URL to be used for APIs calls
 * @return {object} ttb - The instance associated with the provide vertical info
 * @example
 * var ttb = new TTBSDK({
 *   baseURL: 'https://clientx.api.titletoolbox.com/'
 * });
 * */
function TTB(config) {
  var settings;

  settings = {

  };

  this.config = config;
  this.baseURL = config.baseURL;

  console.log('TTB SDK initiated.');
}


/*** All exposed methods, each consuming specific API */
/** foo*/
TTB.prototype.propertySearch = propertySearch;
/** bar */
TTB.prototype.getPropertyProfile = getPropertyProfile;


/*** Functions declarations */

/**
 * Retrieves the `property_id` against given input address
 * @param {string} address - The complete address for the property_id is needed`
 * @return {object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
 * */
function propertySearch(address) {

}

/**
 * Retrieves the complete PDF profile against given `property_id`
 * @param {string} propertyId - The unique id returned for the address via `propertySearch()`
 * @return {object} promise - Jquery AJAX deferred promise is returned which on-success returns the required info.
 * */
function getPropertyProfile(propertyId) {

}