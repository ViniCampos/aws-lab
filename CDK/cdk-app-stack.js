/*
Start installing cdk 
npm install -g aws-cdk-lib

To init cdk app
cdk init app --language javascript

No mesmo projeto, pode criar o código de uma lambda.

Necessário iniciar o CDK na região
cdk bootstrap

Para transformar o código abaixo em CLOUD FORMATION
cdk synth

Deploy CDK Stack
cdk deploy
*/

const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs"); //library with constructs for every AWS resource
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const s3 = require("aws-cdk-lib/aws-s3");

class WidgetService extends Construct {
  constructor(scope, id) {
    super(scope, id);

    const bucket = new s3.Bucket(this, "WidgetStore"); //L2

    const handler = new lambda.Function(this, "WidgetHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "widgets.main",
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    bucket.grantReadWrite(handler); // was: handler.role);

    const api = new apigateway.RestApi(this, "widgets-api", {
      restApiName: "Widget Service",
      description: "This service serves widgets."
    });

    const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {  //L3
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", getWidgetsIntegration); // GET /
  }
}

module.exports = { WidgetService }