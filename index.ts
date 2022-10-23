import { RequestSigner } from 'aws4'
import { CloudFrontRequestEvent, Callback, Context } from 'aws-lambda'
import { Buffer } from 'node:buffer'

export const handler = (
    event: CloudFrontRequestEvent,
    context: Context,
    callback: Callback
) => {
    const request = event.Records[0].cf.request
    delete request.headers['x-forwarded-for'] // fails signature verification if included
    delete request.headers['content-length'] // causing failures on post/put ...
    // assumes <jib>.lambda-url.<region>.on.aws
    const region = request.origin!.custom?.domainName.split('.')[2]

    const signer = new RequestSigner({
        method: request.method,
        hostname: request.origin!.custom?.domainName,
        region,
        path:
            request.uri +
            (request.querystring.length > 0 ? '?' + request.querystring : ''),
        service: 'lambda',
        headers: Object.keys(request.headers).reduce((headers, key) => {
            headers[key] = request.headers[key][0].value
            return headers
        }, {} as { [l: string]: string }),
        body:request.body ?
         Buffer.from(request.body?.data, request.body?.encoding === 'base64'?'base64':'ascii') // should always be base64 https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html
         : ""
    })

    const { headers } = signer.sign()

    for (let head in headers) {
        request.headers[head.toLowerCase()] = [
            {
                key: head,
                value: headers[head]!.toString(),
            },
        ]
    }

    callback(null, request)
}
