export interface BidopixlModelProfile{
  fast:string;
  general:string;
  coding:string;
  advancedCoding:string;
  cloudCoding:string;
  cloudReasoning:string;
}
export const DEFAULT_BIDOPIXL_MODEL_PROFILE:BidopixlModelProfile={
  fast:"qwen3.5:0.8b",
  general:"gemma4:latest",
  coding:"qwen2.5-coder:7b",
  advancedCoding:"deepseek-coder-v2:16b",
  cloudCoding:"kimi-k2.7-code:cloud",
  cloudReasoning:"glm-5.2:cloud"
};
function envModel(env:NodeJS.ProcessEnv,name:string,fallback:string){return (env[name]?.trim()||fallback);}
export function loadBidopixlModelProfile(env:NodeJS.ProcessEnv=process.env):BidopixlModelProfile{
  return{
    fast:envModel(env,"BIDOPIXL_FAST_MODEL",DEFAULT_BIDOPIXL_MODEL_PROFILE.fast),
    general:envModel(env,"BIDOPIXL_GENERAL_MODEL",DEFAULT_BIDOPIXL_MODEL_PROFILE.general),
    coding:envModel(env,"BIDOPIXL_CODING_MODEL",DEFAULT_BIDOPIXL_MODEL_PROFILE.coding),
    advancedCoding:envModel(env,"BIDOPIXL_ADVANCED_CODING_MODEL",DEFAULT_BIDOPIXL_MODEL_PROFILE.advancedCoding),
    cloudCoding:envModel(env,"BIDOPIXL_CLOUD_CODING_MODEL",DEFAULT_BIDOPIXL_MODEL_PROFILE.cloudCoding),
    cloudReasoning:envModel(env,"BIDOPIXL_CLOUD_REASONING_MODEL",DEFAULT_BIDOPIXL_MODEL_PROFILE.cloudReasoning)
  };
}
export function bidopixlModelList(profile:BidopixlModelProfile=DEFAULT_BIDOPIXL_MODEL_PROFILE){
  return [...new Set(Object.values(profile))];
}
