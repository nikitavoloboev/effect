import * as S from "effect/Schema"
import * as Util from "effect/test/Schema/TestUtils"
import { describe, expect, it } from "vitest"

describe("minItems", () => {
  it("should throw for invalid argument", () => {
    expect(() => S.Array(S.Number).pipe(S.minItems(-1))).toThrowError(
      new Error(`Invalid Argument
details: Expected an integer greater than or equal to 1, actual -1`)
    )
  })

  describe("decoding", () => {
    it("Array", async () => {
      const schema = S.Array(S.Number).pipe(S.minItems(2))

      await Util.expectDecodeUnknownSuccess(schema, [1, 2])
      await Util.expectDecodeUnknownSuccess(schema, [1, 2, 3])
      await Util.expectDecodeUnknownFailure(
        schema,
        [],
        `minItems(2)
└─ Predicate refinement failure
   └─ Expected an array of at least 2 item(s), actual []`
      )
      await Util.expectDecodeUnknownFailure(
        schema,
        [1],
        `minItems(2)
└─ Predicate refinement failure
   └─ Expected an array of at least 2 item(s), actual [1]`
      )
    })

    it("NonEmptyArray", async () => {
      const schema = S.NonEmptyArray(S.Number).pipe(S.minItems(2))

      await Util.expectDecodeUnknownSuccess(schema, [1, 2])
      await Util.expectDecodeUnknownSuccess(schema, [1, 2, 3])
      await Util.expectDecodeUnknownFailure(
        schema,
        [],
        `minItems(2)
└─ From side refinement failure
   └─ readonly [number, ...number[]]
      └─ [0]
         └─ is missing`
      )
      await Util.expectDecodeUnknownFailure(
        schema,
        [1],
        `minItems(2)
└─ Predicate refinement failure
   └─ Expected an array of at least 2 item(s), actual [1]`
      )
    })
  })
})
