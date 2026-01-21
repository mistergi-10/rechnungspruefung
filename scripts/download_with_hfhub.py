import sys
from huggingface_hub import snapshot_download

if len(sys.argv) < 2:
    print('Usage: download_with_hfhub.py <repo_id> [dest_dir]')
    sys.exit(1)

repo = sys.argv[1]
if len(sys.argv) >= 3:
    dest = sys.argv[2]
else:
    dest = './models/' + repo.replace('/', '_')

print('Downloading', repo, 'to', dest)
path = snapshot_download(repo_id=repo, local_dir=dest)
print('Downloaded to', path)
