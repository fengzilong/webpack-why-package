const analyze = require( './analyze' )
const format = require( './format' )
const ID = `WebpackWhyPackagePlugin`

module.exports = class WebpackWhyPackagePlugin {
  apply( compiler ) {
    compiler.hooks.done.tap( ID, ( stats, callback ) => {
      console.log()
      console.log( format( analyze( stats.toJson() ) ) )
      console.log()
    } )
  }
}