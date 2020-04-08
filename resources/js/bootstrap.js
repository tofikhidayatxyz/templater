/**
 * Require default plugin
 */

try {
    window._ = require('lodash');
    window.$ = window.jQuery = require('jquery');
    require('bootstrap');
    window.axios = require('axios');
} catch(e) {
    throw e
}