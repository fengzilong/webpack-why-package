const getPackageName = require( 'get-package-name' )
const { normalizePath } = require( './shared' )

module.exports = function analyze( stats = {} ) {
  let assets = stats.assets.filter( asset => asset.chunks.length > 0 )

  assets = assets.map( asset => {
    const chunks = asset.chunks.map( getChunk )
    const modules = [].concat( ...chunks.map( chunk => chunk.modules ) )

    return {
      name: asset.name,
      size: asset.size,
      chunks,
      modules,
      packages: modules
        .filter( mod => mod.packageName )
        .map( ( { packageName: name, size, relativePathInPackage: path, isSelfIssued, issuerName, issuerPath } ) => {
          return {
            name,
            size,
            path,
            issuerName,
            issuerPath,
            isSelfIssued,
          }
        } )
        .reduce( ( memo, {
          name,
          path,
          issuerName,
          issuerPath,
          isSelfIssued,
        } ) => {
          let found = memo.find( m => m.name === name )

          if ( !found ) {
            found = {
              name,
              files: [],
              externalIssuers: []
            }

            memo.push( found )
          }

          found.files.push( {
            path,
            issuerName,
            issuerPath,
            isSelfIssued,
          } )

          if (
            issuerName &&
            !found.externalIssuers.some( issuer => issuer.name === issuerName ) &&
            !isSelfIssued
          ) {
            found.externalIssuers.push( {
              name: issuerName,
              trace: issuerPath,
            } )
          }

          return memo
        }, [] )
    }
  } )

  return assets

  function getChunk( chunkId ) {
    const chunk = stats.chunks.find( chunk => chunk.id === chunkId )
    const modules = chunk.modules || []
    return {
      modules: modules.map( mod => {
        const packageName = getPkgName( mod.name )
        const relativePathInPackage = getRelativePathInPackage( mod.name )
        const issuerPackageName = getPkgName( mod.issuerName )
        const issuerPath = ( mod.issuerPath || [] )
          .map( path => normalizePath( path.name ) )
          .filter( ( name, i, issuers ) => {
            const nextName = issuers[ i + 1 ]
            if ( name === nextName ) {
              return false
            }

            return true
          } )
        issuerPath.reverse()

        return {
          name: mod.name,
          source: mod.source,
          size: mod.size,
          identifier: mod.identifier,
          packageName,
          relativePathInPackage,
          issuerPackageName,
          isSelfIssued: packageName && ( packageName === issuerPackageName ),
          issuer: mod.issuer,
          issuerName: normalizePath( mod.issuerName ),
          issuerPath,
        }
      } )
    }
  }
}

function getPkgName( path ) {
  const normalized = normalizePath( path )
  return getPackageName( normalized )
}

function getRelativePathInPackage( path ) {
  const packageName = getPackageName( path )
  path = normalizePath( path )
  if ( packageName ) {
    return path.split( `node_modules/${ packageName }/` ).pop()
  }

  return ''
}