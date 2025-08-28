using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using FastEndpoints;

namespace Job_worker.Shared.ApiResponses;

public record Error(string? Key, string? Message, string? Solution = null);

public interface ICoreApiResponse : IResult
{
    [HideFromDocs] public HttpStatusCode StatusCode { get; set; }

    public string? Message { get; set; }

    public Task ExecuteAsync(HttpContext httpContext);
}

public interface ICoreApiResponse<T> : ICoreApiResponse
{
    public T? Data { get; set; }
}

public interface ICoreApiErrorResponse : ICoreApiResponse
{
    public List<Error> Errors { get; set; }
}

public class CoreApiResponse : ICoreApiResponse
{
    [HideFromDocs] public HttpStatusCode StatusCode { get; set; }

    public string? Message { get; set; }

    public static CoreApiResponse Ok(SuccessStatusCode statusCode, string? message = null)
    {
        return new CoreApiResponse
        {
            Message = message,
            StatusCode = statusCode.ToHttp()
        };
    }

    public static CoreApiResponse Reject(ClientErrorStatusCode statusCode, string? message = null)
    {
        return new CoreApiResponse
        {
            Message = message,
            StatusCode = statusCode.ToHttp()
        };
    }

    public async Task ExecuteAsync(HttpContext httpContext)
    {
        httpContext.Response.StatusCode = (int)StatusCode;
        httpContext.Response.ContentType = "application/json";
        var json = JsonSerializer.Serialize(this, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        });
        await httpContext.Response.WriteAsync(json);
    }
}

public class CoreApiResponse<T> : CoreApiResponse, ICoreApiResponse<T>
{
    public T? Data { get; set; }

    public static CoreApiResponse<T> Ok(SuccessStatusCode statusCode, T data, string? message = null)
    {
        return new CoreApiResponse<T>
        {
            Data = data,
            Message = message,
            StatusCode = statusCode.ToHttp()
        };
    }

    public static CoreApiResponse<T> Reject(ClientErrorStatusCode statusCode, T data, string? message = null)
    {
        return new CoreApiResponse<T>
        {
            Data = data,
            Message = message,
            StatusCode = statusCode.ToHttp()
        };
    }
    public async Task ExecuteAsync(HttpContext httpContext)
    {
        httpContext.Response.StatusCode = (int)StatusCode;
        httpContext.Response.ContentType = "application/json";
        var json = JsonSerializer.Serialize(this, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        });
        await httpContext.Response.WriteAsync(json);
    }
}

public class CoreApiErrorResponse : CoreApiResponse, ICoreApiErrorResponse
{
    public List<Error> Errors { get; set; } = [];

    public static CoreApiErrorResponse Reject(ClientErrorStatusCode statusCode, List<Error> errors,
        string? message = null)
    {
        return new CoreApiErrorResponse
        {
            Message = message,
            StatusCode = statusCode.ToHttp(),
            Errors = errors
        };
    }

    public static CoreApiErrorResponse Error(ClientErrorStatusCode statusCode, List<Error> errors)
    {
        return new CoreApiErrorResponse
        {
            StatusCode = statusCode.ToHttp(),
            Errors = errors
        };
    }
    public async Task ExecuteAsync(HttpContext httpContext)
    {
        httpContext.Response.StatusCode = (int)StatusCode;
        httpContext.Response.ContentType = "application/json";
        var json = JsonSerializer.Serialize(this, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        });
        await httpContext.Response.WriteAsync(json);
    }
}

public enum SuccessStatusCode
{
    Ok = HttpStatusCode.OK,
    Created = HttpStatusCode.Created,
    Accepted = HttpStatusCode.Accepted,
    NoContent = HttpStatusCode.NoContent
}

public enum ClientErrorStatusCode
{
    BadRequest = HttpStatusCode.BadRequest,
    Unauthorized = HttpStatusCode.Unauthorized,
    Forbidden = HttpStatusCode.Forbidden,
    NotFound = HttpStatusCode.NotFound,
    Conflict = HttpStatusCode.Conflict,
    UnprocessableEntity = HttpStatusCode.UnprocessableEntity,
    InternalServerError = HttpStatusCode.InternalServerError
}

public enum ServerErrorStatusCode
{
    InternalServerError = HttpStatusCode.InternalServerError,
    NotImplemented = HttpStatusCode.NotImplemented,
    BadGateway = HttpStatusCode.BadGateway,
    ServiceUnavailable = HttpStatusCode.ServiceUnavailable
}

public static class StatusCodeExtensions
{
    public static HttpStatusCode ToHttp(this SuccessStatusCode code)
    {
        return (HttpStatusCode)code;
    }

    public static HttpStatusCode ToHttp(this ClientErrorStatusCode code)
    {
        return (HttpStatusCode)code;
    }

    public static HttpStatusCode ToHttp(this ServerErrorStatusCode code)
    {
        return (HttpStatusCode)code;
    }
}