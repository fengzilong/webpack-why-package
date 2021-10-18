/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
const chalk = require( 'chalk' )
const { prettyPath, sortByAlphabet } = require( './shared' )

const atReg = /^@/g

module.exports = function format( assets ) {
  let out = ''

  const emptyAssets = []

  assets
    .filter( asset => ( asset.name && !asset.name.endsWith( '.map' ) ) )
    .forEach( asset => {
      const { packages = [] } = asset

      if ( packages.length > 0 ) {
        out = out + `\n${ chalk.green( asset.name ) }\n\n`

        packages.sort( ( a, b ) => sortByAlphabet( a.name, b.name ) )

        packages
          .forEach( pkg => {
            out = out + `  ${ chalk.blue( pkg.name ) } ${ chalk.dim( 'is issued by' ) }\n`

            if ( pkg.externalIssuers.length > 0 ) {
              pkg.externalIssuers.sort( ( a, b ) => sortIssuer( a.name, b.name ) )

              out = out + pkg.externalIssuers.map( issuer => {
                return `\n    → ` + prettyPath( issuer.trace[ 0 ] ) +
                  issuer.trace.slice( 1 ).map( ( parentIssuer, i ) => {
                    return '\n\n' + ' '.repeat( i * 2 + 5 ) + chalk.dim( ' ↳ ' ) + prettyPath( parentIssuer )
                  } ).join( '' )
              } ).join( '\n' )
            } else {
              out = out + `\n    → ${ chalk.bold( 'Self' ) } ${ chalk.dim( '( As Entrypoint )' ) }`
            }

            out = out + '\n\n'
          } )
      } else {
        emptyAssets.push( asset )
      }
    } )

  if ( emptyAssets.length > 0 ) {
    out = out + emptyAssets.map( asset => `${ chalk.green( asset.name ) }` ).join( ',\n' )
    out = out + '\n\n  No package found for these assets\n\n'
  }

  return out
}

function containsNodeModules( path ) {
  return path.includes( 'node_modules' )
}

function containsAt( path ) {
  return path.includes( '@' )
}

function sortIssuer( aName, bName ) {
  if ( containsNodeModules( aName ) && !containsNodeModules( bName ) ) {
    return 1
  }

  if ( !containsNodeModules( aName ) && containsNodeModules( bName ) ) {
    return -1
  }

  if ( containsAt( aName ) && !containsAt( bName ) ) {
    return -1
  }

  if ( !containsAt( aName ) && containsAt( bName ) ) {
    return 1
  }

  return aName.replace( atReg, '' ).localeCompare( bName.replace( atReg, '' ) )
}