# aws-cdk-serverless-101

APIGateway with CORS, Lambdas, and CRUD on DynamoDB using AWS CDK

## プロジェクトのセットアップ

```bash
# プロジェクトのディレクトリを作成する
mkdir aws-cdk-serverless-101
cd aws-cdk-serverless-101

# TypeScriptベースでAWS CDKのプロジェクトを作る
cdk init app --language=typescript
```

このとき、作成したプロジェクトディレクトリが空でないとエラーになる。

### AWS CDK App の内訳

- `bin/aws-cdk-serverless-101.ts`: アプリの（メインの）エントリーポイント
- `lib/aws-cdk-serverless-101-stack.ts`: サービススタックの定義

### サービススタックの構築

```bash
yarn add @aws-cdk/aws-dynamodb @aws-cdk/aws-lambda @aws-cdk/aws-apigateway
```
