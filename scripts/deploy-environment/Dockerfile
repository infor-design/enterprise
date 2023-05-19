FROM node:14-buster

WORKDIR /usr/src

RUN apt-get update \
  && apt upgrade -y \
  && apt-get install -y \
  software-properties-common \
  build-essential \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  zlib1g-dev \
  libncurses5-dev \
  libgdbm-dev \
  libnss3-dev \
  libssl-dev \
  libreadline-dev \
  libffi-dev \
  libsqlite3-dev \
  libbz2-dev \
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

RUN mkdir -p /tmp
RUN wget -O /tmp/Python-3.10.0.tgz https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tgz
RUN tar -xf /tmp/Python-3.10.0.tgz -C /tmp
RUN cd /tmp/Python-3.10.0/ \
  && ./configure --enable-optimizations \
  && make -j 4 \
  && make altinstall

COPY ./requirements.txt requirements.txt
COPY ./manifests manifests
COPY ./scripts scripts
COPY ./build_push_image.sh build_push_image.sh

RUN python3.10 -m pip install -r requirements.txt
RUN chmod +x scripts/annotations.py
RUN chmod +x build_push_image.sh

COPY ./utils.sh utils.sh
RUN chmod +x utils.sh

COPY ./build_push_manifests.sh build_push_manifests.sh
RUN chmod +x build_push_manifests.sh
