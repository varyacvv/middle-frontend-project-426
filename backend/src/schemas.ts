// @ts-nocheck
/* eslint eslint-comments/no-unlimited-disable: off */
/* eslint-disable */
// This document was generated automatically by openapi-box

/**
 * @typedef {import('@sinclair/typebox').TSchema} TSchema
 */

/**
 * @template {TSchema} T
 * @typedef {import('@sinclair/typebox').Static<T>} Static
 */

/**
 * @typedef {import('@sinclair/typebox').SchemaOptions} SchemaOptions
 */

/**
 * @typedef {{
 *  [Path in keyof typeof schema]: {
 *    [Method in keyof typeof schema[Path]]: {
 *      [Prop in keyof typeof schema[Path][Method]]: typeof schema[Path][Method][Prop] extends TSchema ?
 *        Static<typeof schema[Path][Method][Prop]> :
 *        undefined
 *    }
 *  }
 * }} SchemaType
 */

/**
 * @typedef {{
 *  [ComponentType in keyof typeof _components]: {
 *    [ComponentName in keyof typeof _components[ComponentType]]: typeof _components[ComponentType][ComponentName] extends TSchema ?
 *      Static<typeof _components[ComponentType][ComponentName]> :
 *      undefined
 *  }
 * }} ComponentType
 */

import { Type as T, TypeRegistry, Kind, CloneType } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

/**
 * @typedef {{
 *  [Kind]: 'Binary'
 *  static: string | File | Blob | Uint8Array
 *  anyOf: [{
 *    type: 'object',
 *    additionalProperties: true
 *  }, {
 *    type: 'string',
 *    format: 'binary'
 *  }]
 * } & TSchema} TBinary
 */

/**
 * @returns {TBinary}
 */
const Binary = () => {
  /**
   * @param {TBinary} schema
   * @param {unknown} value
   * @returns {boolean}
   */
  function BinaryCheck(schema, value) {
    const type = Object.prototype.toString.call(value);
    return (
      type === "[object Blob]" ||
      type === "[object File]" ||
      type === "[object String]" ||
      type === "[object Uint8Array]"
    );
  }

  if (!TypeRegistry.Has("Binary")) TypeRegistry.Set("Binary", BinaryCheck);

  return /** @type {TBinary} */ {
    anyOf: [
      {
        type: "object",
        additionalProperties: true,
      },
      {
        type: "string",
        format: "binary",
      },
    ],
    [Kind]: "Binary",
  };
};

const ComponentsSchemasUser = T.Object({
  id: T.Integer({ format: "int32" }),
  email: T.String(),
});
const ComponentsSchemasApiError = T.Object({
  code: T.String(),
  message: T.String(),
});
const ComponentsSchemasLoginRequest = T.Object({
  email: T.String(),
  password: T.String(),
});
const ComponentsSchemasRegisterRequest = T.Object({
  email: T.String(),
  password: T.String(),
});

const schema = {
  "/api/auth/login": {
    POST: {
      args: T.Object({
        body: CloneType(ComponentsSchemasLoginRequest, {
          "x-content-type": "application/json",
        }),
      }),
      data: T.Union(
        [
          CloneType(ComponentsSchemasUser),
          CloneType(ComponentsSchemasApiError),
        ],
        { "x-status-code": "200", "x-content-type": "application/json" },
      ),
      error: T.Union([T.Any({ "x-status-code": "default" })]),
    },
  },
  "/api/auth/logout": {
    POST: {
      args: T.Void(),
      data: T.Any({ "x-status-code": "204" }),
      error: T.Union([T.Any({ "x-status-code": "default" })]),
    },
  },
  "/api/auth/me": {
    GET: {
      args: T.Void(),
      data: T.Union(
        [
          CloneType(ComponentsSchemasUser),
          CloneType(ComponentsSchemasApiError),
        ],
        { "x-status-code": "200", "x-content-type": "application/json" },
      ),
      error: T.Union([T.Any({ "x-status-code": "default" })]),
    },
  },
  "/api/auth/register": {
    POST: {
      args: T.Object({
        body: CloneType(ComponentsSchemasRegisterRequest, {
          "x-content-type": "application/json",
        }),
      }),
      data: CloneType(ComponentsSchemasApiError, {
        "x-status-code": "200",
        "x-content-type": "application/json",
      }),
      error: T.Union([T.Any({ "x-status-code": "default" })]),
    },
  },
  "/api/health": {
    GET: {
      args: T.Void(),
      data: T.Object(
        {
          status: T.String(),
        },
        {
          "x-status-code": "200",
          "x-content-type": "application/json",
        },
      ),
      error: T.Union([T.Any({ "x-status-code": "default" })]),
    },
  },
};

const _components = {
  schemas: {
    ApiError: CloneType(ComponentsSchemasApiError),
    LoginRequest: CloneType(ComponentsSchemasLoginRequest),
    Money: T.Object({
      amount: T.Integer({ format: "int32" }),
    }),
    RegisterRequest: CloneType(ComponentsSchemasRegisterRequest),
    User: CloneType(ComponentsSchemasUser),
  },
};

export { schema, _components as components };
