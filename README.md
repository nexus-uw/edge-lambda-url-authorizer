# edge-lambda-url-authorizer
npm pkg to sigv4 sign cloudfront viewer requests to lambda function urls with IAM auth

this lets us limit the lambda function url to only be invoked though the configured cloudfront distribution (ie:  custom domain, caching policy, WAF, edge routing, etc)

# how to use 

```npm i edge-lambda-url-authorizer```

in your index.(js|ts) 
```export { handler } from 'edge-lambda-url-authorizer'```

<build + upload lambda>

from lambda console, set the entry point to index.handler

grant the lambda iam role the action *'lambda:InvokeFunctionUrl'*(resource can be whichever functions you want to sign for)

(you may need to also update the trusted principals to include edgelambda.amazonaws.com alongside lambda.amazonaws.com AND also update the resources pattern to include all regions for the log group permissions)


# cdk example
see [ammobin-cdk](https://github.com/ammobinDOTca/ammobin-cdk)

TODO: actually explain whats going on