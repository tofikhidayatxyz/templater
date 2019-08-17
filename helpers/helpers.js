const env = require('dotenv').config();
const edge = require('edge.js');
/**
** trying helpers contents
**/
let public_title = "";
let public_active = []; 
/**
** edge register assets command 
**/
edge.global('asset', function(file) {
    return "assets/"+file;
});
/**
** set title
**/
edge.global('title',function(title){
    public_title = title;
    return "";
});
/**
** get title
**/
edge.global('getTitle',function(title){
    var assert  =  public_title;
    public_title =  "";
    if (assert.length > 0) {
        assert  = assert + " | ";
    }
    return assert;
});
/**
** handle style sheet
**/
edge.global('style',function(file){
    var uri  = (file.includes('https') || file.includes('http') ? file :  'assets/css/'+file);
    return '<link rel="stylesheet" type="text/css" href="'+uri+'"> '
});
/**
**handle javascript modeule
**/
edge.global('script',function(file){
    var uri  = (file.includes('https') || file.includes('http') ? file :  'assets/css/'+file);
    return '<script type="text/javascript" src="'+uri+'" ></script>'
})

/**
** set active
**/
edge.global('setActive',function(request){
    public_active = [];
    if (Array.isArray(request)) {
        for (var i = 0 ;  i < request.length; ++i ) {
            public_active .push(request[i]);
        }
    } else {
        public_active .push(request);    
    }
    return " ";
});
edge.global('getActive',function(request , param=''){
    var assert = "";
    var pub_at = [];
    for (var i = 0; i < public_active.length; i++) {
         if (request == public_active[i]) {
            if (param != "") {
                assert = param;
            } else {
                assert = "active";
            }
        } else {
            pub_at.push(public_active[i])
        }
    }
    public_active  =  pub_at;
    return assert;
});
