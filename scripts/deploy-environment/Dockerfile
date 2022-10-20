FROM node:14-buster

WORKDIR /usr/src

RUN apt-get update \
  && apt-get install -y \
  software-properties-common \
  build-essential \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  jq

RUN mkdir -p /etc/apt/keyrings
RUN  curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update \
  && apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-compose-plugin \
  && apt-get clean

RUN mkdir -p /root/.ssh && touch /root/.ssh/config
RUN echo "[url \"git@github.com:\"]\n\tinsteadOf = https://github.com/" >> /root/.gitconfig
RUN echo "StrictHostKeyChecking no " > /root/.ssh/config
RUN git config --global url."https://{token}:@github.com/".insteadOf "https://github.com/"

COPY ./manifests manifests

COPY ./build_push_image.sh build_push_image.sh
RUN chmod +x build_push_image.sh

COPY ./build_push_manifests.sh build_push_manifests.sh
RUN chmod +x build_push_manifests.sh
