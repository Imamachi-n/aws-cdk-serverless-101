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

### プログラム内のすべてのスタックを確認

```bash
cdk ls
```

## AWS CDK のアップグレード

### プロジェクト内のパッケージのアップグレード

```bash
# アップデートが必要なパッケージのチェック
$ npx npm-check-updates -u
Upgrading /Users/imamachinaoto/Documents/aws-cdk-serverless-101/package.json
[====================] 14/14 100%

 @aws-cdk/aws-apigateway   ^1.20.0  →  ^1.24.0
 @aws-cdk/aws-dynamodb     ^1.20.0  →  ^1.24.0
 @aws-cdk/aws-lambda       ^1.20.0  →  ^1.24.0
 @aws-cdk/core             ^1.20.0  →  ^1.24.0
 @aws-cdk/assert           ^1.20.0  →  ^1.24.0
 @types/jest              ^24.0.22  →  ^25.1.2
 @types/node               10.17.5  →   13.7.1
 aws-cdk                   ^1.20.0  →  ^1.24.0
 jest                      ^24.9.0  →  ^25.1.0
 ts-jest                   ^24.1.0  →  ^25.2.0
 ts-node                    ^8.1.0  →   ^8.6.2
 typescript                 ~3.7.2  →   ~3.7.5

# 全てのパッケージをアップグレード
$ yarn install
$ yarn upgrade

# もう一度確認
$ npx npm-check-updates -u
Upgrading /Users/imamachinaoto/Documents/aws-cdk-serverless-101/package.json
[====================] 14/14 100%

All dependencies match the latest package versions :)
```

### CDK CLI のアップグレード

```bash
yarn global upgrade aws-cdk@1.24.0
```

## AWS CloudFormation のテンプレートを確認

```bash
cdk synth
```

## AWS へ AWS CDK アプリをデプロイ

### 初回のみ

対象の AWS CDK アプリを初めて AWS の環境にデプロイする場合、ブートストラップスタック（bootstrap stack）をインストールする必要があります。例えば、CloudFormation のテンプレートファイルを S3 バケットに保存するなど、デプロイのオペレーションに必要なものを用意してくれます。

```bash
$ cdk bootstrap
 ⏳  Bootstrapping environment aws://123456789001/ap-northeast-1...
CDKToolkit: creating CloudFormation changeset...
 0/2 | 1:45:42 PM | CREATE_IN_PROGRESS   | AWS::S3::Bucket | StagingBucket
 0/2 | 1:45:44 PM | CREATE_IN_PROGRESS   | AWS::S3::Bucket | StagingBucket Resource creation Initiated
 1/2 | 1:46:06 PM | CREATE_COMPLETE      | AWS::S3::Bucket | StagingBucket
 2/2 | 1:46:08 PM | CREATE_COMPLETE      | AWS::CloudFormation::Stack | CDKToolkit
 ✅  Environment aws://123456789001/ap-northeast-1 bootstrapped.
```

### AWS へのデプロイ

```bash
cdk deploy
This deployment will make potentially sensitive changes according to your current security approval level (--require-approval broadening).
Please confirm you intend to make the following modifications:

...

 ✅  AwsCdkServerless101Stack

Outputs:
AwsCdkServerless101Stack.greetingApiEndpoint2C291B85 = https://xxxxxe7y5j.execute-api.ap-northeast-1.amazonaws.com/prod/

...
```

### AWC CDK アプリの削除

```bash
$ cdk destroy
Are you sure you want to delete: AwsCdkServerless101Stack (y/n)? y
AwsCdkServerless101Stack: destroying...

...

 ✅  AwsCdkServerless101Stack: destroyed
```
