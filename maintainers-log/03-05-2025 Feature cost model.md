The current state, 1 year into hobby time development, is that with single sentence the workflows can set up a whole
repository focused on a single mission, gather current information to expanded the mission into into features and
develop a simple command line or webb app. This commit created an app with a CLI and web front end to print out random faces:

>>> Create a CLI app that outputs random facial expressions using ascii art. This will be the emotional feedback mechanism for an AI.

Key problems which remain are; when to stop, and there is still build work before a revenue stream can be established.

An idea today is to create a cost model for the features. The cost model will be the actual resources used and this,
combined with the implementation of a definition of done, will provide the mechanism to optimise the workflows.

The focus at the moment is an MVP of something hooked into intentïon.com, then a BYO Keys in GitHub Action in GitHub Marketplace.

I year ago something that could resolve eslint issues above the capabilities --fix, seemed ground breaking, today
generating a whole app is a late entrant to the market. Handing over a self-directed coding system is more interesting.

Also today, the first security incident. The secrets.env file (which only has read access to public repository),
may have been disclosed and was not visible but used a well known file pattern and it should have remain secret. All
potentially impacted repositories will be checked and all the keys rotated and the publication process examined.

Update: it was a false positive, the secrets.env file was not in the repository just the local workspace sop when I
switched to the pages branch it was visible locally but never remote and never disclosed. The keys were rotated before RCA.
