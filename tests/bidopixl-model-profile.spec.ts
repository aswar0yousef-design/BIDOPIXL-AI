import {DEFAULT_BIDOPIXL_MODEL_PROFILE,bidopixlModelList,loadBidopixlModelProfile} from "../src/config/bidopixl-model-profile.js";
const profile=loadBidopixlModelProfile({
 BIDOPIXL_FAST_MODEL:"fast-local",
 BIDOPIXL_GENERAL_MODEL:"general-local",
 BIDOPIXL_CODING_MODEL:"coding-local",
 BIDOPIXL_ADVANCED_CODING_MODEL:"advanced-local",
 BIDOPIXL_CLOUD_CODING_MODEL:"cloud-coding",
 BIDOPIXL_CLOUD_REASONING_MODEL:"cloud-reasoning"
});
if(profile.fast!=="fast-local"||profile.general!=="general-local"||profile.coding!=="coding-local"||profile.advancedCoding!=="advanced-local"||profile.cloudCoding!=="cloud-coding"||profile.cloudReasoning!=="cloud-reasoning")throw new Error("BIDOPIXL model profile environment overrides failed.");
if(bidopixlModelList(DEFAULT_BIDOPIXL_MODEL_PROFILE).length!==6)throw new Error("BIDOPIXL model profile contains duplicate or missing models.");
if(DEFAULT_BIDOPIXL_MODEL_PROFILE.general!=="gemma4:latest")throw new Error("Unexpected BIDOPIXL general model.");
if(DEFAULT_BIDOPIXL_MODEL_PROFILE.coding!=="qwen2.5-coder:7b")throw new Error("Unexpected BIDOPIXL coding model.");
if(DEFAULT_BIDOPIXL_MODEL_PROFILE.advancedCoding!=="deepseek-coder-v2:16b")throw new Error("Unexpected BIDOPIXL advanced coding model.");
console.log("BIDOPIXL model profile tests passed.");
