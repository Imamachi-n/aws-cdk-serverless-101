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

## AWS へのデプロイ
