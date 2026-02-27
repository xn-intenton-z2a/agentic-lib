With the diacritic "intentïon" is the brand representing a collection of automations into a product that will work to
achieve an intention.

At fist an intention was to output a message, the echo intention, this never completed naturally
but reached a limit of iterations per intention. Next there was countdown which could complete or not depending on
which was higher, the number to count down from, or the maximum number of iterations. This workflow building stage
topped out with the random guess-a-number game as random then switched OpenAI's chat.

The next stage was a description of a single code bug (specifically an `eslint` hint at a bug) which required broader
scoped prompts to apply a general solution and evaluate completion. The product value add at this stage was that the
workflows could resolve items flagged by `eslint` but too complex to be resolved by `eslint --fix`. Summer 2024 was an exciting
time, a great deal of effort was applied to getting prompts to return structured data, there were many tests and 
the class hierarchy was a little brittle. The bug fix interation was expanded to iterate through chunks of bugs (or anything)
captured in the SARIF data format applied chunks of code at a time. This meant the original definition of the intention
fulfilment was now an iteration on a single axis within axes of bugs and versions of the code (which changes with each chunk).
An intention was now expanded to match the ability to fix a whole batch of issues in one file descriped in SARIF format.
The first product was `apply-sarif-fixes` as a GitHub Action with community version with BYO keys and a paid version with
contract billing. This was dull but the workflow behind `apply-sarif-fixes` was the real asset and getting one product
out created the platform to expand upon.

The GitHub Action was nearing completion at the end of summer 2024. The action was working and deployed to a showcase
repository, `repository0`. The definition of an intention stretched in another two dimensions with multiple source
files and the exciting realisation that fixing bugs such as 'nested ternary' was a tiny step from "implement TODO".
Where the previous axis of intention was a batch of bugs in a file, the additional dimensions are now multiple files
each which might contain directives to implement and the directives may also spawn further directives. At this point
my enthusiasm for `apply-sarif-fixes` was waning and butting up against SARIF as an input.

The big idea to launch `apply-sarif-fixes` was for the AI to create a library for space efficient encoding of numeric 
data in text by using the full range of printable characters. Where for example, "01" in this text is taking up two 
characters, in UTF-8 there are 256 sequences of (numbers 0 through 255), not all are distinguishable in text but a better
encoding than decimal digits should be possible when the human preference for base10 is not useful. This was working but
not making groundbreaking discoveries. UTF-8 can be efficiently used with base64, more efficiently with base85, but it
was not necessary to expand beyond 8 bits because UTF-32 is already space efficient by not always using 4 bytes per
character. There is UTF-16 which according to Wikipedia was used by Windows but I hadn't heard of it and switching to
UTF-32 would be easier than a brand new encoding. At this point an "intention" that the workflows would target is up to
the scope of a whole software repository (keeping it JavaScript for Node 20 with ESM for simplicity).

In November 2024, ChatGPT model 4 came out, and structured responses were possible. In last January 2025 o3 was
released to my OpenAI usage tier. I came home from climbing and tried pasting whole source files into the ChatGPT web
client with bugs in including 'please fix' and I was astonished that it worked up to large source files in a human scale.
There hasn't been a paradime shift for intentïon here but the value is in question if the chunking problem was solved
upstream and free text is valid input. An experiment was conducted: Supply a text prompt fragment to a single GitHub
Actions Workflow that called out to ChatGPT using inline code to deliver a response to the prompt fragment as code and
commit it to the repository. ChatGPT and Co-Pilot helped me vibe code the workflows and it worked. About 8 months of
my hobby time between March 2024 and January 2025 was spent on some JS code that could be replaced by a single workflow
built in 1 night.

The pace of upstream technology change has devalued where what I built upon previous pinnacles of no longer reaches
the height of the latest developments. A high-code valuation is a fantasy and the last delusion that I might be early
to the market disappeared when I saw the video for GitHub's project Padawan in March 2025. In April 2025 the `agentic-lib`
was resembling feature parity with Project Padawan but I'm personally using Junie (not my own workflows) so we are not
ahead in vibe coding. 

`intentïon` is now the brand and consumer face of a tool to seed a software repository with a mission (the intention)
and a set of workflows which will iterate upon that mission. There is a chat interface, and there will be a simple
click-through for users to create their own repository and a commercial offering to use contract billing. What's lacking
is a definition of "done" and it may be necessary to add a "supervisor" to co-ordinate the GitHub Workflows. Ideally, 
only the paid version would require the supervisor (because this incurs a hosting cost) and the community version
would get there in the end. The value add being speed and reduced oversight delivered through hosted services.
