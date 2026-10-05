import {VerificationEngine} from "../src/core/verification.js";
import type {Mission} from "../src/core/types.js";

function mission(overrides:Partial<Mission>={}):Mission{
 return{
  id:"verification-test",
  goal:"Execute verification test",
  status:"verifying",
  risk:"low",
  requiredPermission:"L1_READ",
  steps:[
   {id:"execute",description:"Run requested action",status:"completed"},
   {id:"verify",description:"Verify result",status:"pending"}
  ],
  createdAt:new Date().toISOString(),
  ...overrides
 };
}

const verifier=new VerificationEngine();

const undefinedResult=verifier.verify(mission(),undefined,[]);
if(undefinedResult.verified||!undefinedResult.failures.includes("Execution returned no result."))throw new Error("Undefined execution result was accepted.");

const missingExecution=verifier.verify(mission({steps:[{id:"plan",description:"Understand goal",status:"completed"}]}),{ok:true},[]);
if(missingExecution.verified||!missingExecution.failures.includes("Mission has no execution step."))throw new Error("Mission without an execution step was accepted.");

const failedExecution=verifier.verify(mission({steps:[{id:"execute",description:"Execute requested action",status:"failed"}]}),{ok:true},[]);
if(failedExecution.verified||!failedExecution.failures.includes("Execution step is not completed."))throw new Error("Failed execution step was accepted.");

const toolSuccess=verifier.verify(mission(),{ok:true,tool:"runtime.status",ready:true},["The call to runtime.status should execute successfully."]);
if(!toolSuccess.verified||toolSuccess.failures.length!==0)throw new Error("Successful runtime.status tool call was not accepted.");

const wrongTool=verifier.verify(mission(),{ok:true,tool:"runtime.health"},["The call to runtime.status should execute successfully."]);
if(wrongTool.verified||!wrongTool.failures.some(failure=>failure.includes("actual tool")))throw new Error("A different successful tool was incorrectly accepted.");

const failedTool=verifier.verify(mission(),{ok:false,tool:"runtime.status"},["The call to runtime.status should execute successfully."]);
if(failedTool.verified||!failedTool.failures.some(failure=>failure.includes("ok=false")))throw new Error("A failed runtime.status tool call was incorrectly accepted.");

const emptyCriterion=verifier.verify(mission(),{ok:true},[""]);
if(emptyCriterion.verified||!emptyCriterion.failures.includes("Success criteria contains an empty item."))throw new Error("Empty success criterion was accepted.");

console.log("Verification hardening passed.");
