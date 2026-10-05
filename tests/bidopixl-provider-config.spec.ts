import {configureProviders,loadProviderConfig} from "../src/config/providers.js";

const local=loadProviderConfig({
  LAYANX_AI_MODE:"local",
  OLLAMA_ENABLED:"true",
  OLLAMA_BASE_URL:"http://127.0.0.1:11434",
  BIDOPIXL_OLLAMA_CLOUD_ENABLED:"false"
});
const localRuntime=configureProviders(local);
const localModels=localRuntime.models.list().filter(model=>model.provider==="ollama");
if(localModels.length!==4)throw new Error("BIDOPIXL local profile should register exactly four local Ollama models.");
if(localModels.some(model=>!model.local))throw new Error("Local BIDOPIXL profile contains a non-local model.");
for(const expected of ["qwen3.5:0.8b","gemma4:latest","qwen2.5-coder:7b","deepseek-coder-v2:16b"]){
  if(!localModels.some(model=>model.id===expected))throw new Error("Missing BIDOPIXL local model: "+expected);
}

const hybrid=loadProviderConfig({
  LAYANX_AI_MODE:"hybrid",
  OLLAMA_ENABLED:"true",
  OLLAMA_BASE_URL:"http://127.0.0.1:11434",
  BIDOPIXL_OLLAMA_CLOUD_ENABLED:"true"
});
const hybridRuntime=configureProviders(hybrid);
const cloudModels=hybridRuntime.models.list().filter(model=>model.tags?.includes("cloud"));
if(cloudModels.length!==2)throw new Error("BIDOPIXL cloud profile should register exactly two opt-in cloud models.");
if(cloudModels.some(model=>model.local))throw new Error("BIDOPIXL cloud models must not be marked local.");
if(!cloudModels.some(model=>model.id==="kimi-k2.7-code:cloud"))throw new Error("Missing BIDOPIXL cloud coding model.");
if(!cloudModels.some(model=>model.id==="glm-5.2:cloud"))throw new Error("Missing BIDOPIXL cloud reasoning model.");

const overridden=loadProviderConfig({
  LAYANX_AI_MODE:"local",
  OLLAMA_ENABLED:"true",
  BIDOPIXL_GENERAL_MODEL:"custom-general",
  BIDOPIXL_CODING_MODEL:"custom-coding"
});
if(overridden.bidopixl.general!=="custom-general"||overridden.bidopixl.coding!=="custom-coding")throw new Error("BIDOPIXL model overrides were not applied.");
console.log("BIDOPIXL provider configuration tests passed.");
