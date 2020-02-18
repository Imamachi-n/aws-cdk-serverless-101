import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as cdk from "@aws-cdk/core";
import { Duration } from "@aws-cdk/core";

export class AwsCdkServerless101Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // (1) DynamoDB
    // Construct - id - tableProps
    // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-dynamodb/tableprops.html#aws_dynamodb_TableProps
    const greetingTable = new dynamodb.Table(this, "greeting", {
      partitionKey: {
        name: "greetingId",
        type: dynamodb.AttributeType.STRING,
      },
      tableName: "greeting",

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY, // FIXME: NOT recommended for production code
    });

    // (2) Lambda Function
    // Construct - id - functionProps
    const putGreetingItemLambda = new lambda.Function(
      this,
      "putGreetingItemLambda",
      {
        // The source code of your Lambda function.
        // You can point to a file in an Amazon S3 bucket
        // or specify your source code as inline text.
        // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-lambda/functionprops.html#aws_lambda_FunctionProps_code
        // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-lambda/code.html#aws_lambda_Code_asset
        code: lambda.Code.asset("src/lambda"),

        // The name of the method within your code that Lambda calls to execute your function.
        // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-lambda/functionprops.html#aws_lambda_FunctionProps_handler
        handler: "hello-cdk.handler",

        // The runtime environment for the Lambda function
        // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-lambda/runtime.html#aws_lambda_Runtime
        runtime: lambda.Runtime.NODEJS_10_X,

        // The function execution time (in seconds) after which Lambda terminates the function.
        // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-lambda/functionprops.html#aws_lambda_FunctionProps_timeout
        timeout: Duration.seconds(15),

        // Key-value pairs (Environment variables) that Lambda caches and makes available for your Lambda functions.
        // FIXME: Check REGION variable if it's correct.
        environment: {
          GREETING_TABLE_NAME: greetingTable.tableName,
          REGION:
            props && props.env!.region ? props.env!.region : "ap-northeast-1",
        },
      }
    );

    // (5) grant (create IAM Principle for lambda to be able to access to DynamoDB)
    // Permits an IAM principal to all data read/write operations to this table.
    greetingTable.grantReadWriteData(putGreetingItemLambda);

    // (6) api gateway
    // Represents a REST API in Amazon API Gateway.
    // By default, the API will automatically be deployed and accessible from a public endpoint.
    // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/restapiprops.html#aws_apigateway_RestApiProps
    const api = new apigateway.RestApi(this, "greetingApi", {
      // A name for the API Gateway RestApi resource.
      // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/restapiprops.html#aws_apigateway_RestApiProps_restApiName
      restApiName: "hello-cdk-greeting",
    });

    // Represents the root resource ("/") of this API. Use it to define the API model:
    // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/restapi.html#aws_apigateway_RestApi_root
    // Endpoint: `/greeting`
    const greetingResource = api.root.addResource("greeting");

    // (7) request integration
    // Integrates an AWS Lambda function to an API Gateway method.
    // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/lambdaintegration.html#aws_apigateway_LambdaIntegration
    // Lambda handler - options (LambdaIntegrationOptions)
    const putGreetingItemIntegration = new apigateway.LambdaIntegration(
      putGreetingItemLambda, // Lambda handler
      // Options
      // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/integrationoptions.html#aws_apigateway_IntegrationOptions
      // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/lambdaintegrationoptions.html#aws_apigateway_LambdaIntegrationOptions
      {
        proxy: false,
        // The response that API Gateway provides after a method's backend completes processing a request.
        // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/integrationoptions.html#aws_apigateway_IntegrationOptions_integrationResponses
        integrationResponses: [
          {
            statusCode: "200",
            // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/integrationresponse.html#aws_apigateway_IntegrationResponse_responseTemplates
            // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
            responseTemplates: {
              // This function evaluates a JSONPath expression and returns the results as a JSON string.
              // For example, $input.json('$.pets') returns a JSON string representing the pets structure.
              // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#input-variable-reference
              "application/json": '$input.json("$")',
            },
          },
        ],
        // Specifies the pass-through behavior for incoming requests based on the Content-Type header in the request,
        // and the available mapping templates specified as the requestTemplates property on the Integration resource.
        // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/integrationoptions.html#aws_apigateway_IntegrationOptions_passthroughBehavior
        // Passes the request body for unmapped content types through to the integration back end without transformation.
        // https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-apigateway/passthroughbehavior.html#aws_apigateway_PassthroughBehavior
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
        requestTemplates: {
          "application/json": '$input.json("$")',
        },
      }
    );
    greetingResource.addMethod("POST", putGreetingItemIntegration, {
      methodResponses: [{ statusCode: "200" }],
    });
  }
}

const app = new cdk.App();
new AwsCdkServerless101Stack(app, "AwsCdkServerless101");
app.synth();
