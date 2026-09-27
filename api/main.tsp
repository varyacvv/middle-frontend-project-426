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

// Заглушка, чтобы не было пустых paths и components.
@route("/api/health")
@get
op health(): {
    status: string;
};
