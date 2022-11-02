import yaml
import pytz
import argparse
from datetime import datetime

def run(path):
  with open(path, "r+") as f:
    f_data = f.read()
    f.seek(0)
    as_dict = yaml.safe_load(f_data)
    as_dict["spec"]["template"]["metadata"]["annotations"] = {
      "kubectl.kubernetes.io/restartedAt": datetime.now(pytz.utc).strftime("%m-%d-%Y, %H:%M:%S")
    }
    f.write(yaml.dump(as_dict))
    f.truncate()

def get_args():
  arg_parser = argparse.ArgumentParser()
  arg_parser.add_argument('-p', '--file-path', help='path to a file', type=str, required=True, dest='path')
  p_args = arg_parser.parse_args()
  return vars(p_args)

if __name__ == "__main__":
  args = get_args()
  path = args["path"]
  run(path)
