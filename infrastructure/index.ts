import * as pulumi from "@pulumi/pulumi";
import * as resources from '@pulumi/azure-native/resources';
import * as containerregistry from '@pulumi/azure-native/containerregistry';

// Import the configuration settings for the current stack.
const config = new pulumi.Config()
const appPath = config.require('appPath')
const prefixName = config.require('prefixName')
const imageName = prefixName
const imageTag = config.require('imageTag')
// Azure container instances (ACI) service does not yet support port mapping
// so, the containerPort and publicPort must be the same
const containerPort = config.requireNumber('containerPort')
const publicPort = config.requireNumber('publicPort')
const cpu = config.requireNumber('cpu')
const memory = config.requireNumber('memory')

// Sanitize prefixName to remove non-alphanumeric characters for the registry name
const sanitizedPrefixName = prefixName.replace(/[^a-zA-Z0-9]/g, "");

// Create a resource group.
const resourceGroup = new resources.ResourceGroup(`${prefixName}-rg`)

// Create the container registry.
const registry = new containerregistry.Registry(`${sanitizedPrefixName}ACR`, {
  resourceGroupName: resourceGroup.name,
  adminUserEnabled: true,
  sku: {
    name: containerregistry.SkuName.Basic,
  },
})

// Get authentication credentials for the container registry
const registryCredentials = containerregistry
  .listRegistryCredentialsOutput({
    resourceGroupName: resourceGroup.name,
    registryName: registry.name,
  })
  .apply((creds) => {
    return {
      username: creds.username!,
      password: creds.passwords![0].value!,
    };
  });

  