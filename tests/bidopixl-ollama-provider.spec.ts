import {createOllamaProvider} from "../src/providers/ollama-provider.js";

const calls:string[]=[];
const fetcher=async (input:RequestInfo|URL,init?:RequestInit)=>{
  const url=String(input); calls.push((init?.method??"GET")+" "+url);
  if(url.endsWith("/api/tags"))return new Response(JSON.stringify({models:[{name:"gemma4:latest"},{name:"qwen2.5-coder:7b"}]}),{status:200,headers:{"content-type":"application/json"}});
  if(url.endsWith("/api/chat"))return new Response(JSON.stringify({message:{content:"ok"}}),{status:200,headers:{"content-type":"application/json"}});
  return new Response("not found",{status:404});
};
const provider=createOllamaProvider({baseUrl:"http://ollama.test",fetcher,autoSelectInstalledModel:false});
const health=await provider.health();
if(!health.available)throw new Error("Mock Ollama health should be available.");
const result=await provider.generate(
 {id:"qwen2.5-coder:7b",provider:"ollama",capabilities:["chat","coding"],local:true,enabled:true,priority:1},
 {capability:"coding",input:"hello"}
);
if(result.provider!=="ollama"||result.modelId!=="qwen2.5-coder:7b"||result.output!=="ok")throw new Error("Ollama adapter returned an unexpected identity or output.");

let missing=false;
try{
 await provider.generate(
  {id:"kimi-k2.7-code:cloud",provider:"ollama",capabilities:["chat","coding"],local:false,enabled:true,priority:1},
  {capability:"coding",input:"hello"}
 );
}catch(error){missing=error instanceof Error&&error.message.includes("HTTP 404");}
if(!missing)throw new Error("Missing Ollama model must fail closed instead of being silently relabeled.");
console.log("BIDOPIXL Ollama provider tests passed.");
