import "@typespec/http";

using TypeSpec.Http;

@service(#{ title: "PC Parts Shop API" })
namespace PcPartsShop;
// Денежная сумма в целых рублях, без копеек
@doc("Money amount in rubles")
model Money {
    amount: int32;
}
// Общий формат ошибок для всех ресурсов API
@doc("Common API error format shared by all endpoints")
model ApiError {
    code: string;
    message: string;
}
// Модели пользователя
@doc("User account.")
model User {
    id: int32;
    email: string;
}

@doc("Payload for user registration.")
model RegisterRequest {
    email: string;
    password: string;
}

@doc("Payload for user sign-in.")
model LoginRequest {
    email: string;
    password: string;
}
// Операции
@route("/api/health")
@get
op health(): {
    status: string;
};

@route("/api/auth/register")
@post
@doc("Register a new user and start a session")
op register(@body body: RegisterRequest):
    | {
          @statusCode statusCode: 201;
          @body user: User;
      }
    | ApiError;

@route("/api/auth/login")
@post
@doc("Sign in an existing user and start a session")
op login(@body body: LoginRequest): User | ApiError;

@route("/api/auth/logout")
@post
@doc("Sign out the current user and end the session")
op logout(): {
    @statusCode statusCode: 204;
};

@route("/api/auth/me")
@get
@doc("Get the currently authenticated user")
op me(): User | ApiError;

// Модели каталога
@doc("Product category.")
model Category {
    id: int32;
    slug: string;
    name: string;
}

@doc("Product in the catalog.")
model Product {
    id: int32;
    slug: string;
    name: string;
    description: string;
    price: Money;
    inStock: boolean;
    imageUrl: string | null;
    category: Category;
}

@doc("Filters and pagination for the product list.")
model ProductListParams {
    @doc("Category slug. Empty means all categories.")
    @query
    category?: string;

    @doc("Minimum price in whole rubles.")
    @query
    priceMin?: int32;

    @doc("Maximum price in whole rubles.")
    @query
    priceMax?: int32;

    @doc("Only products in stock.")
    @query
    available?: boolean;

    @doc("Search by product name.")
    @query
    search?: string;

    @doc("Page number, 1-based.")
    @query
    page?: int32;
}

@doc("Paginated list of products.")
model ProductList {
    items: Product[];
    total: int32;
    page: int32;
    pageSize: int32;
}

// Операции каталога

@route("/api/categories")
@get
@doc("List all categories.")
op listCategories(): Category[];

@route("/api/products")
@get
@doc("List products with filters and pagination.")
op listProducts(...ProductListParams): ProductList | ApiError;

@route("/api/products/{slug}")
@get
@doc("Get a single product by slug.")
op getProduct(@path slug: string): Product | ApiError;

// Модели промо-блоков
@doc("Promo block shown on the home page. Links to a single product.")
model PromoBlock {
    id: int32;
    title: string;
    text: string;
    product: Product;
}

// Операции промо-блоков

@route("/api/promos")
@get
@doc("List promo blocks for the home page.")
op listPromos(): PromoBlock[];

// Модели заказов

@doc("Order status.")
enum OrderStatus {
    paid: "paid",
}

@doc("Delivery or pickup.")
enum DeliveryMethod {
    delivery: "delivery",
    pickup: "pickup",
}

@doc("Snapshot of a product inside an order.")
model OrderItem {
    productId: int32;
    name: string;
    price: Money;
    quantity: int32;
}

@doc("A completed order.")
model Order {
    id: int32;
    status: string;
    createdAt: string;
    method: string;
    name: string;
    phone: string;
    address: string | null;
    total: Money;
    items: OrderItem[];
}

@doc("Single item of a create order request.")
model OrderItemInput {
    slug: string;
    quantity: int32;
}

@doc("Payload for order creation. Contains no prices.")
model CreateOrderRequest {
    method: "delivery" | "pickup";
    name: string;
    phone: string;
    address?: string;
    items: OrderItemInput[];
}

@doc("Problematic item that blocked an order.")
model OrderErrorItem {
    slug: string;
    reason: string;
}

@doc("Order was rejected because some products are unavailable.")
model OrderError extends ApiError {
    unavailable: OrderErrorItem[];
}

// Операции заказов

@route("/api/orders")
@post
@doc("Create a new order from the current cart.")
op createOrder(@body body: CreateOrderRequest):
    | {
          @statusCode statusCode: 201;
          @body order: Order;
      }
    | OrderError;

@route("/api/orders")
@get
@doc("List orders of the current user.")
op listOrders(): Order[];

@route("/api/orders/{id}")
@get
@doc("Get a single order by id.")
op getOrder(@path id: int32): Order | ApiError;
