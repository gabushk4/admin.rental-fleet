export const HOST = 'http://local.api.rental-fleet.com'
export const API_KEY = 'api_sk_dev_DHkq1I8IHoBZm0QFiPcQm9fUszLEjd5mHsGxoTaH2F0'

export const METHOD = Object.freeze({
    get : 'GET',
    post : 'POST',
    delete : 'DELETE'
});

export const ROUTES = Object.freeze({
    products: '/products',
    getProducts : { route : '/products', method : METHOD.get },
    createProduct : { route : '/products', method : METHOD.post },
    deleteProduct : { route : '/products', method : METHOD.delete, },
})

export const HEADER = Object.freeze({
    contentType : 'Content-Type',
    location: 'Location',
    XApiKey: 'X-Api-Key'
});

export const CONTENT_TYPE = Object.freeze({
    formUrlEncoded : 'application/x-www-form-urlencoded',
    applicationJson : 'application/json',
    multipartFormData : 'multipart/form-data'
});

export const HTTP_STATUS = Object.freeze({
    OK : 200,
    Created : 201,
    NoContent : 204,
    BadRequest : 400,
    NotFound : 404, 
    MethodNotAllowed : 405,
    Conflict: 409,
    ContentTooLarge: 413,
    UnsupportedMedia: 415,
    InternalServerError : 500,
    ServiceUnavailable: 503,
});

export const TEXT = Object.freeze({
    
    errorOccurred : 'An error has occurred',
    fieldsMissingValuesInvalid: 'Fields are missing or values are invalid',
    unsupportedMediaType : 'The file Media Type is unsupported',
    contentTooLarge : 'The file size is too Large',
    
    productCreated : 'The product has been created',
    productNameAlreadyExists : 'The product name already exists',
    productSaved : 'The product has been saved',
    productNotExists : 'The product does not exists',
    productDeleted: 'The product has been deleted',
    ServiceUnavailable: 'Server is unavailable'
    
});

export const PRODUCT = Object.freeze({
    id : 'id',
    name : 'name',
    picture : 'picture',
    price : 'price'
});