/* eslint-disable no-magic-numbers */
const chalk = require( 'chalk' )
const getPackageName = require( 'get-package-name' )

const cleanSuffixReg = /\s+\+\s+\d+\s+modules$/g
const cleanPrefixReg = /^multi\s+/g

function normalizePath( path ) {
  path = path || ''

  path = path.replace( cleanPrefixReg, '' )

  if ( path.includes( '!' ) ) {
    path = path.split( '!' ).pop()
  }

  if ( path.includes( '?' ) ) {
    path = path.split( '?' )[ 0 ]
  }

  path = path.replace( cleanSuffixReg, '' )

  return path
}

const prettyReg = /^.\/|^\//g
const nodeModulesReg = /^node_modules\//g
function prettyPath( path ) {
  path = path.replace( prettyReg, '' )

  if ( nodeModulesReg.test( path ) ) {
    const packageName = getPackageName( path )
    path = path.replace( nodeModulesReg, '' )
    path = chalk.bold( `${ packageName }` ) + path.slice( packageName.length )
  }

  return path
}

// `@` before non-`@`, and sort rest elements by alphabet
function sortByAlphabet( a, b ) {
  if ( startsWithAt( a ) && !startsWithAt( b ) ) {
    return -1
  }

  if ( !startsWithAt( a ) && startsWithAt( b ) ) {
    return 1
  }

  return a.localeCompare( b )
}

function startsWithAt( string = '' ) {
  return string.startsWith( '@' )
}

exports.normalizePath = normalizePath
exports.prettyPath = prettyPath
exports.sortByAlphabet = sortByAlphabet
