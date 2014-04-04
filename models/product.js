/**
 * Product getting products by search term from Best Buy.
 */
 
module.exports = function(options) {
  options = options || {};
  var mongoose = options.mongoose || require('mongoose')
  , Schema = mongoose.Schema;
 
  var ProductSchema = new Schema({
    url : {
      type : String
    },
    regularPrice : {
      type : String
    },
    productId : { type : String}
  });
 
  var Product = mongoose.model("products", ProductSchema);
}