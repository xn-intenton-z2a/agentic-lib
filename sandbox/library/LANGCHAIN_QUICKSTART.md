# LANGCHAIN_QUICKSTART

## Crawl Summary
Installation: npm install langchain openai. Environment: set OPENAI_API_KEY. Imports: OpenAI, PromptTemplate, LLMChain. OpenAI options: modelName:string, temperature:number, maxRetries:number, streaming:boolean, timeout:number. PromptTemplate args: template:string, inputVariables:string[]. LLMChain args: llm:BaseLanguageModel, prompt:PromptTemplate. chain.call({ inputVar:value }): Promise<{text:string}>.

## Normalised Extract
Table of Contents
1 Installation
2 Environment Configuration
3 Module Imports
4 Instantiating OpenAI LLM
5 PromptTemplate Creation
6 LLMChain Setup
7 Chain Execution

1 Installation
Command: npm install langchain openai

2 Environment Configuration
Set environment variable OPENAI_API_KEY to your OpenAI API key.
Unix: export OPENAI_API_KEY="your_api_key"
Windows: set OPENAI_API_KEY="your_api_key"

3 Module Imports
For ESM:
  import { OpenAI } from "langchain"
  import { PromptTemplate } from "langchain/prompts"
  import { LLMChain } from "langchain/chains"
For CJS:
  const { OpenAI } = require("langchain")
  const { PromptTemplate } = require("langchain/prompts")
  const { LLMChain } = require("langchain/chains")

4 Instantiating OpenAI LLM
Code:
  const model = new OpenAI({ modelName:"gpt-3.5-turbo", temperature:0.7, maxRetries:3, streaming:false, timeout:60000 })
Options:
  modelName default gpt-3.5-turbo
  temperature default 1.0
  maxRetries default 6
  streaming default false
  timeout default 60000 ms

5 PromptTemplate Creation
Code:
  const prompt = new PromptTemplate({ template:"Translate the following English text to French: {text}", inputVariables:["text"] })

6 LLMChain Setup
Code:
  const chain = new LLMChain({ llm:model, prompt:prompt })

7 Chain Execution
Code:
  const response = await chain.call({ text:"I love programming." })
  response.text contains model output

## Supplementary Details
OpenAI constructor parameters:
interface OpenAIInput extends BaseLanguageModelParams {
  modelName?: string (default 'gpt-3.5-turbo')
  temperature?: number (default 1.0)
  maxRetries?: number (default 6)
  streaming?: boolean (default false)
  timeout?: number (milliseconds, default 60000)
}

PromptTemplate parameters:
interface PromptTemplateArgs {
  template: string
  inputVariables: string[]
  partialVariables?: Record<string,string>
}

LLMChain parameters:
interface LLMChainParams {
  llm: BaseLanguageModel
  prompt: PromptTemplate
}

Implementation steps:
1 Install langchain and openai
2 Set OPENAI_API_KEY
3 Import OpenAI, PromptTemplate, LLMChain
4 Instantiate OpenAI with desired options
5 Create PromptTemplate with template and inputVariables
6 Instantiate LLMChain with llm and prompt
7 Call chain.call with mapping of input variables
8 Handle returned Promise resolving to { text: string }

## Reference Details
class OpenAI {
  constructor(input: OpenAIInput)
  call(prompt: string): Promise<string>
}

interface OpenAIInput extends BaseLanguageModelParams {
  modelName?: string
  temperature?: number
  maxRetries?: number
  streaming?: boolean
  timeout?: number
}

class PromptTemplate {
  constructor(args: PromptTemplateArgs)
  format(values: Record<string,string>): string
}

interface PromptTemplateArgs {
  template: string
  inputVariables: string[]
  partialVariables?: Record<string,string>
}

class LLMChain {
  constructor(params: LLMChainParams)
  call(inputs: Record<string,string>): Promise<{ text: string }>
}

environment variable: OPENAI_API_KEY must be set to a valid key.

Best practices:
- temperature between 0.5 and 0.9 for balanced creativity
- implement retry logic around chain.call
- use streaming:true for progressive output

Troubleshooting:
Missing OPENAI_API_KEY error: verify environment variable spelling and restart process
ESM import error: add "type":"module" to package.json
Network timeouts: increase timeout option above expected response time

## Information Dense Extract
npm install langchain openai; export OPENAI_API_KEY; import OpenAI, PromptTemplate, LLMChain; const model=new OpenAI({modelName:'gpt-3.5-turbo',temperature:0.7,maxRetries:3,streaming:false,timeout:60000}); const prompt=new PromptTemplate({template:'Translate the following English text to French: {text}',inputVariables:['text']}); const chain=new LLMChain({llm:model,prompt:prompt}); const response=await chain.call({text:'I love programming.'}); response.text

## Sanitised Extract
Table of Contents
1 Installation
2 Environment Configuration
3 Module Imports
4 Instantiating OpenAI LLM
5 PromptTemplate Creation
6 LLMChain Setup
7 Chain Execution

1 Installation
Command: npm install langchain openai

2 Environment Configuration
Set environment variable OPENAI_API_KEY to your OpenAI API key.
Unix: export OPENAI_API_KEY='your_api_key'
Windows: set OPENAI_API_KEY='your_api_key'

3 Module Imports
For ESM:
  import { OpenAI } from 'langchain'
  import { PromptTemplate } from 'langchain/prompts'
  import { LLMChain } from 'langchain/chains'
For CJS:
  const { OpenAI } = require('langchain')
  const { PromptTemplate } = require('langchain/prompts')
  const { LLMChain } = require('langchain/chains')

4 Instantiating OpenAI LLM
Code:
  const model = new OpenAI({ modelName:'gpt-3.5-turbo', temperature:0.7, maxRetries:3, streaming:false, timeout:60000 })
Options:
  modelName default gpt-3.5-turbo
  temperature default 1.0
  maxRetries default 6
  streaming default false
  timeout default 60000 ms

5 PromptTemplate Creation
Code:
  const prompt = new PromptTemplate({ template:'Translate the following English text to French: {text}', inputVariables:['text'] })

6 LLMChain Setup
Code:
  const chain = new LLMChain({ llm:model, prompt:prompt })

7 Chain Execution
Code:
  const response = await chain.call({ text:'I love programming.' })
  response.text contains model output

## Original Source
LangChain JS Documentation
https://js.langchain.com/docs/get_started/quickstart

## Digest of LANGCHAIN_QUICKSTART

# LangChain JS Quickstart

## Installation

npm install langchain openai

## Environment Configuration

Set environment variable OPENAI_API_KEY to your OpenAI key

Unix
  export OPENAI_API_KEY="your_api_key"
Windows
  set OPENAI_API_KEY="your_api_key"

## Importing Modules

For ECMAScript Modules
  import { OpenAI } from "langchain"
  import { PromptTemplate } from "langchain/prompts"
  import { LLMChain } from "langchain/chains"

For CommonJS
  const { OpenAI } = require("langchain")
  const { PromptTemplate } = require("langchain/prompts")
  const { LLMChain } = require("langchain/chains")

## Instantiating the LLM

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  maxRetries: 3,
  streaming: false,
  timeout: 60000
})

## Defining a Prompt Template

const prompt = new PromptTemplate({
  template: "Translate the following English text to French: {text}",
  inputVariables: ["text"]
})

## Creating and Running the Chain

const chain = new LLMChain({
  llm: model,
  prompt: prompt
})

async function run() {
  const response = await chain.call({ text: "I love programming." })
  console.log(response.text)
}

run()


## Attribution
- Source: LangChain JS Documentation
- URL: https://js.langchain.com/docs/get_started/quickstart
- License: License if known
- Crawl Date: 2025-05-17T18:28:49.305Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-17
