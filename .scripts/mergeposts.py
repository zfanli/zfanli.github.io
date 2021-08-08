from pathlib import Path
import argparse
import shutil
import re


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process some integers.")
    # in path: posts need to be merged
    parser.add_argument("in_path", metavar="i", type=str)
    # out path: the path posts need to be merged into
    parser.add_argument("out_path", metavar="o", type=str)
    # get arguments
    args = parser.parse_args()
    # print(args.in_path, args.out_path)

    output = Path(args.out_path)
    # remove output folder if exists
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)

    for child in Path(args.in_path).iterdir():
        if child.is_dir():
            shutil.copytree(child, output.joinpath(child.name))
        else:
            # make the output name
            name = ""
            for n in child.stem:
                # keep letters and numbers only, replace others as hyphens
                if re.match(r"[a-zA-Z0-9]", n):
                    name += n
                else:
                    name += "-"
            # remove contiguous hyphens
            name = re.sub(r"--+", "-", name)
            # remove trailing hyphen
            name = re.sub(r"-$", "", name) + child.suffix

            shutil.copy2(child, output.joinpath(name))
