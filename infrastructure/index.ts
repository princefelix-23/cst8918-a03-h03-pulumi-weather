import * as pulumi from "@pulumi/pulumi";

// Import the configuration settings for the current stack
const config = new pulumi.Config();

// Application path (relative to this file)
const appPath = config.require('appPath');

// Prefix name for naming resources
const prefixName = config.require('prefixName');

// Image name (based on prefix)
const imageName = prefixName;

// Image tag (version)
const imageTag = config.require('imageTag');

// Azure container instances (ACI) service does not support port mapping,
// so containerPort and publicPort must be the same
const containerPort = config.requireNumber('containerPort');
const publicPort = config.requireNumber('publicPort');

// Resource limits for CPU and memory
const cpu = config.requireNumber('cpu');
const memory = config.requireNumber('memory');
