import os
from huggingface_hub import HfApi

def load_env(path='.env.local'):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line=line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            k,v=line.split('=',1)
            os.environ.setdefault(k, v)

def main():
    load_env()
    token = os.environ.get('HUGGINGFACEHUB_API_TOKEN')
    print('Using token set:', bool(token))
    api = HfApi()
    try:
        who = api.whoami()
        print('whoami:', who.get('name') or who.get('user', who))
    except Exception as e:
        print('whoami error:', repr(e))
    try:
        info = api.model_info('mistralai/mistral-7b-instruct')
        print('model_info OK: ', info.modelId if hasattr(info,'modelId') else getattr(info,'id', 'unknown'))
    except Exception as e:
        print('model_info error:', repr(e))

if __name__ == '__main__':
    main()
