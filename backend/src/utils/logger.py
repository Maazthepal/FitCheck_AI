import os
import sys
import logging

logging_str="[%(asctime)s: %(levelname)s: %(module)s: %(message)s]"

log_dir="logs"
log_filepath=os.path.join(log_dir,"logging.log")
os.makedirs(log_dir,exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format=logging_str,
    handlers=[
        logging.FileHandler(log_filepath),
        logging.StreamHandler(sys.stdout)
    ]
)

# Keep this for global use if needed
logger=logging.getLogger("outfitraterlogger")

# ADD THIS FUNCTION AT THE BOTTOM:
def get_logger(name: str = "outfitraterlogger"):
    return logging.getLogger(name)
