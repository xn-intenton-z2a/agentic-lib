FROM public.ecr.aws/lambda/nodejs:20

WORKDIR /var/task

ARG HANDLER=src/lib/main.digestLambdaHandler
ENV HANDLER=$HANDLER

ARG PERSONAL_ACCESS_TOKEN
ENV PERSONAL_ACCESS_TOKEN=$PERSONAL_ACCESS_TOKEN

RUN echo "@xn-intenton-z2a:registry=https://npm.pkg.github.com" > ~/.npmrc
RUN echo "//npm.pkg.github.com/:_authToken=$PERSONAL_ACCESS_TOKEN" >> ~/.npmrc
RUN echo "always-auth=true" >> ~/.npmrc

COPY package.json package-lock.json ./
RUN npm install --production
COPY src/ src/

# Use shell form so the environment variable gets expanded.
CMD sh -c "exec $HANDLER"

ENTRYPOINT /lambda-entrypoint.sh $HANDLER
