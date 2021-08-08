from pathlib import Path
import argparse

SOURCE = Path(".").parent.joinpath("source")
POSTS_DIR = SOURCE.joinpath("_posts")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process some integers.")
    parser.add_argument("in_path", metavar="i", type=str)
    parser.add_argument("out_path", metavar="o", type=str)

    args = parser.parse_args()
    print(args.in_path, args.out_path)
