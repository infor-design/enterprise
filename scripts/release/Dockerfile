FROM node:20

WORKDIR /usr/src

RUN apt-get update \
    && apt-get install -y \
    software-properties-common \
    build-essential

RUN apt-get -y update \
    && apt-get -y install \
    zip \
    git \
    wget \
    curl

    RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip ./aws

RUN curl -L "https://gitlab.com/gitlab-org/cli/-/releases/v1.41.0/downloads/glab_1.41.0_Linux_x86_64.tar.gz" -o "glab.tar.gz" && \
    tar -xvf glab.tar.gz && \
    cp bin/glab /usr/local/bin/glab && \
    chmod +x /usr/local/bin/glab && \
    rm -rf glab.tar.gz bin

RUN mkdir -p /root/.ssh && touch /root/.ssh/config
RUN echo "StrictHostKeyChecking no " > /root/.ssh/config

COPY ./run.sh run.sh
RUN chmod +x run.sh

ENTRYPOINT ["/bin/bash", "run.sh"]
