const { expect } = require('@jest/globals')
const { analyze, format } = require( '../' )
const stats = require( './fixtures/stats.json' )

test( `basic`, () => {
  expect( analyze( stats ) ).toMatchSnapshot()
  expect( format( analyze( stats ) ) ).toMatchSnapshot()
} )