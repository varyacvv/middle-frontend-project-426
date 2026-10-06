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
const ComponentsSchemasCategory = T.Object({
  id: T.Integer({ format: "int32" }),
  slug: T.String(),
  name: T.String(),
});
const ComponentsParametersProductListParamsCategory = T.Any();
const ComponentsParametersProductListParamsPriceMin = T.Any();
const ComponentsParametersProductListParamsPriceMax = T.Any();
const ComponentsParametersProductListParamsAvailable = T.Any();
const ComponentsParametersProductListParamsSearch = T.Any();
const ComponentsParametersProductListParamsPage = T.Any();
const ComponentsSchemasMoney = T.Object({
  amount: T.Integer({ format: "int32" }),
});
const ComponentsSchemasProduct = T.Object({
  id: T.Integer({ format: "int32" }),
  slug: T.String(),
  name: T.String(),
  description: T.String(),
  price: CloneType(ComponentsSchemasMoney),
  inStock: T.Boolean(),
  imageUrl: T.Union([T.Null(), T.String()]),
  category: CloneType(ComponentsSchemasCategory),
});
const ComponentsSchemasProductList = T.Object({
  items: T.Array(CloneType(ComponentsSchemasProduct)),
  total: T.Integer({ format: "int32" }),
  page: T.Integer({ format: "int32" }),
  pageSize: T.Integer({ format: "int32" }),
});
const ComponentsSchemasPromoBlock = T.Object({
  id: T.Integer({ format: "int32" }),
  title: T.String(),
  text: T.String(),
  product: CloneType(ComponentsSchemasProduct),
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
  "/api/categories": {
    GET: {
      args: T.Void(),
      data: T.Array(CloneType(ComponentsSchemasCategory), {
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
  "/api/products": {
    GET: {
      args: T.Optional(
        T.Object({
          query: T.Optional(
            T.Object({
              category: T.Optional(T.String({ "x-in": "query" })),
              priceMin: T.Optional(
                T.Integer({ format: "int32", "x-in": "query" }),
              ),
              priceMax: T.Optional(
                T.Integer({ format: "int32", "x-in": "query" }),
              ),
              available: T.Optional(T.Boolean({ "x-in": "query" })),
              search: T.Optional(T.String({ "x-in": "query" })),
              page: T.Optional(T.Integer({ format: "int32", "x-in": "query" })),
            }),
          ),
        }),
      ),
      data: T.Union(
        [
          CloneType(ComponentsSchemasProductList),
          CloneType(ComponentsSchemasApiError),
        ],
        { "x-status-code": "200", "x-content-type": "application/json" },
      ),
      error: T.Union([T.Any({ "x-status-code": "default" })]),
    },
  },
  "/api/promos": {
    GET: {
      args: T.Void(),
      data: T.Array(CloneType(ComponentsSchemasPromoBlock), {
        "x-status-code": "200",
        "x-content-type": "application/json",
      }),
      error: T.Union([T.Any({ "x-status-code": "default" })]),
    },
  },
};

const _components = {
  parameters: {
    "ProductListParams.available": T.Optional(T.Boolean({ "x-in": "query" })),
    "ProductListParams.category": T.Optional(T.String({ "x-in": "query" })),
    "ProductListParams.page": T.Optional(
      T.Integer({ format: "int32", "x-in": "query" }),
    ),
    "ProductListParams.priceMax": T.Optional(
      T.Integer({ format: "int32", "x-in": "query" }),
    ),
    "ProductListParams.priceMin": T.Optional(
      T.Integer({ format: "int32", "x-in": "query" }),
    ),
    "ProductListParams.search": T.Optional(T.String({ "x-in": "query" })),
  },
  schemas: {
    ApiError: CloneType(ComponentsSchemasApiError),
    Category: CloneType(ComponentsSchemasCategory),
    LoginRequest: CloneType(ComponentsSchemasLoginRequest),
    Money: CloneType(ComponentsSchemasMoney),
    Product: CloneType(ComponentsSchemasProduct),
    ProductList: CloneType(ComponentsSchemasProductList),
    PromoBlock: CloneType(ComponentsSchemasPromoBlock),
    RegisterRequest: CloneType(ComponentsSchemasRegisterRequest),
    User: CloneType(ComponentsSchemasUser),
  },
};

export { schema, _components as components };
