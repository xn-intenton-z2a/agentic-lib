FROM public.ecr.aws/lambda/nodejs:20

WORKDIR /var/task

ARG HANDLER=src/lib/main.digestLambdaHandler
ENV HANDLER=$HANDLER

# Only use ARG for build-time, don't create ENV variables for secrets
ARG PERSONAL_ACCESS_TOKEN
ARG NPM_AUTH_ORGANISATION=@xn-intenton-z2a

# Configure npm for GitHub packages during build only
RUN echo "$NPM_AUTH_ORGANISATION:registry=https://npm.pkg.github.com" > ~/.npmrc && \
    echo "//npm.pkg.github.com/:_authToken=$PERSONAL_ACCESS_TOKEN" >> ~/.npmrc && \
    echo "always-auth=true" >> ~/.npmrc

COPY package.json package-lock.json ./
RUN npm install --production && \
    # Remove .npmrc after installation to avoid keeping credentials in the image
    rm -f ~/.npmrc
COPY src/ src/

# Use JSON form for CMD and ENTRYPOINT
# Use a shell command in CMD to expand the environment variable
CMD ["sh", "-c", "exec $HANDLER"]

# Use a fixed ENTRYPOINT without environment variables
ENTRYPOINT ["/lambda-entrypoint.sh"]
