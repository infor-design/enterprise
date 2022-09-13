#!/bin/bash

set -e

supervisord -c /etc/supervisor/supervisord.conf
supervisorctl reread && supervisorctl reload

while :; do
  sleep 300
done

exec "$@"