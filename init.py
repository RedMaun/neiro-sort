import json
import os

current_directory = os.getcwd()

config = current_directory + '/public/config.json'

def config_gen(conifg, data):
    with open(conifg,'w',encoding='ascii') as f:
        json.dump(data, f)

def config_load(config):
    with open(config, encoding='ascii') as f:
        return json.load(f)

cfg = config_load(config)

data_folder = os.path.join(current_directory, r'{}'.format(cfg["data_folder"]))
if not os.path.exists(data_folder):
    os.makedirs(data_folder)

sort_folder = os.path.join(current_directory, r'{}'.format(cfg["sort_folder"]))
if not os.path.exists(sort_folder):
    os.makedirs(sort_folder)

buffer_folder = os.path.join(current_directory, r'{}'.format(cfg["buffer_folder"]))
if not os.path.exists(buffer_folder):
    os.makedirs(buffer_folder)

def init():
    print('Write your categories(item1, item2, item3):')
    categories = input().replace(' ', '').split(',')
    return categories

def check():
    while True:
        categories = init()
        print(str(categories) + ' is this right? [y/n]')
        ans = input()
        if (ans.lower() == 'y'):
            return categories
    
categories = check()
cfg["categories"] = categories

config_gen(config, cfg)

for i in range(len(cfg["categories"])):
    final_directory = os.path.join(sort_folder, r'{}'.format(cfg["categories"][i]))
    if not os.path.exists(final_directory):
        os.makedirs(final_directory)

