# edge-lambda-url-authorizer
npm pkg to sigv4 sign cloudfront viewer requests to [Lambda Function URLs with IAM auth](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html)

# why?
- can limit the Lambda Function URL to only be invoked though the configured cloudfront distribution. enabling one to add the following to their function
  - custom domain 
  - caching policy
  - AWS Shield + WAF protection
  - edge routing, 
  - etc
- apply an iam resource policy (handy for cross account access)
- better security than just a hardcoded secret http header shared
- appsec compliance scanners may not 'like' exposed endpoints without authentication enabled. using a cloudfront distribution can help address this 'vulnerability'
- all the above for under 2ms of extra time (P90)

# how to use 

```npm i edge-lambda-url-authorizer```

in your index.(js|ts) 
```export { handler } from 'edge-lambda-url-authorizer'```

<build + upload lambda>

from lambda console, set the entry point to index.handler

grant the lambda iam role the action *'lambda:InvokeFunctionUrl'*(resource can be whichever functions you want to sign for)

(you may need to also update the trusted principals to include edgelambda.amazonaws.com alongside lambda.amazonaws.com AND also update the resources pattern to include all regions for the log group permissions)


# exmaples/users
## CDK (ammobin.ca)
- (edge lambda code) https://github.com/ammobinDOTca/ammobin-cdk/tree/master/lambdas/edge-signer
- (lambda resource definition + integration) https://github.com/ammobinDOTca/ammobin-cdk/blob/master/lib/ammobin-global-cdk-stack.ts#L48-L84 + https://github.com/ammobinDOTca/ammobin-cdk/blob/master/lib/ammobin-global-cdk-stack.ts#L209-L211
