import os
import shutil
import subprocess
import tarfile
import sys

sys.stdout.reconfigure(encoding='utf-8')

target_dir = os.path.join(os.environ.get('LOCALAPPDATA', ''), 'ms-playwright-go', '1.57.0')
os.makedirs(target_dir, exist_ok=True)
print(f"Target directory: {target_dir}")

# 1. Copy node.exe
node_src = r'C:\Program Files\nodejs\node.exe'
node_dst = os.path.join(target_dir, 'node.exe')
if os.path.exists(node_src):
    shutil.copy2(node_src, node_dst)
    print(f"Copied node.exe to: {node_dst}")
else:
    print(f"ERROR: node.exe not found at {node_src}")

# 2. Pack playwright-core@1.57.0
temp_dir = os.path.join(target_dir, '_temp')
os.makedirs(temp_dir, exist_ok=True)
print("Packing playwright-core@1.57.0 via npm...")
cmd = "npm pack playwright-core@1.57.0"
res = subprocess.run(cmd, cwd=temp_dir, shell=True, capture_output=True, text=True)
print(f"npm pack returned {res.returncode}")
if res.stdout:
    print(res.stdout)
if res.stderr:
    print(res.stderr)

tgz_files = [f for f in os.listdir(temp_dir) if f.endswith('.tgz')]
if tgz_files:
    tgz_path = os.path.join(temp_dir, tgz_files[0])
    print(f"Extracting {tgz_path} to {target_dir}...")
    with tarfile.open(tgz_path, 'r:gz') as tar:
        tar.extractall(path=target_dir)
    print("Extracted successfully!")
    shutil.rmtree(temp_dir, ignore_errors=True)

# 3. Test running the driver
cli_js = os.path.join(target_dir, 'package', 'cli.js')
if os.path.exists(cli_js):
    print(f"cli.js verified at: {cli_js}")
    # Also create playwright.cmd wrapper just in case
    cmd_content = f'@echo off\n"{node_dst}" "{cli_js}" %*\n'
    with open(os.path.join(target_dir, 'playwright.cmd'), 'w') as f:
        f.write(cmd_content)
    print("Created playwright.cmd wrapper.")

    # Install Chromium browser binary using the driver
    print("Installing Playwright Chromium browser binaries...")
    install_res = subprocess.run([node_dst, cli_js, 'install', 'chromium'], capture_output=True, text=True)
    print(f"Install status: {install_res.returncode}")
    if install_res.stdout:
        print(install_res.stdout[:500])
    if install_res.stderr:
        print(install_res.stderr[:500])
else:
    print(f"ERROR: cli.js not found at {cli_js}")

print("Playwright driver setup finished.")
