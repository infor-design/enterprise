FROM node:18

WORKDIR /usr/src

RUN apt-get update && \
    apt-get install -y \
        software-properties-common \
        build-essential \
        git

RUN npm install release-it -g

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm ./awscliv2.zip && rm -fr ./aws

RUN mkdir -p /root/.ssh && touch /root/.ssh/config && \
    echo "[url \"git@github.com:\"]\n\tinsteadOf = https://github.com/" >> /root/.gitconfig && \
    echo "StrictHostKeyChecking no " > /root/.ssh/config && \
    git config --global url."https://{token}:@github.com/".insteadOf "https://github.com/"

COPY ./run.sh run.sh
RUN chmod +x run.sh

ENTRYPOINT ["/bin/bash", "run.sh"]
