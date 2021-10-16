const analyze = require( './analyze' )
const format = require( './format' )
const ID = `WebpackWhyPackagePlugin`

module.exports = class WebpackWhyPackagePlugin {
  apply( compiler ) {
    compiler.hooks.done.tap( ID, stats => {
      let out = ''

      try {
        out = format( analyze( stats.toJson() ) )
      } catch ( e ) {}

      if ( out ) {
        console.log()
        console.log( out )
        console.log()
      }
    } )
  }
}
