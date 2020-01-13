#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkServerless101Stack } from '../lib/aws-cdk-serverless-101-stack';

const app = new cdk.App();
new AwsCdkServerless101Stack(app, 'AwsCdkServerless101Stack');
