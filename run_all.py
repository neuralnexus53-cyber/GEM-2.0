import os
import sys
import subprocess
import time
import signal

# Enable UTF-8 encoding for Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

processes = []

def print_banner():
    print("\n" + "=" * 80)
    print(" [GovVendor AI] Sovereign Procurement Suite (SIH Project 2026)")
    print(" Unified Monorepo · Double-Blind Vault & Shared Relational Database")
    print("=" * 80)
    print(f" * Workspace Root: {ROOT_DIR}")
    print("=" * 80)
    print(" Starting Local Infrastructure...\n")

def start_backend():
    print(" [1/2] Booting FastAPI Shared Backend on http://127.0.0.1:8000 ...")
    env = os.environ.copy()
    env["PYTHONPATH"] = ROOT_DIR
    
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "backend.app.main:app",
        "--host",
        "0.0.0.0",
        "--port",
        "8000",
        "--reload"
    ]
    proc = subprocess.Popen(cmd, cwd=ROOT_DIR, env=env)
    processes.append(("FastAPI Shared Backend", proc))
    return proc

def start_unified_frontend():
    print(" [2/2] Booting Unified Portal App on http://localhost:5173 ...")
    cmd = "npm run dev"
    proc = subprocess.Popen(cmd, cwd=ROOT_DIR, shell=True)
    processes.append(("Unified Portal (Vite)", proc))
    return proc

def cleanup_all(sig=None, frame=None):
    print("\n\nStopping GovVendor AI services cleanly...")
    for name, proc in processes:
        try:
            print(f" * Stopping {name}...")
            if sys.platform == "win32":
                subprocess.call(["taskkill", "/F", "/T", "/PID", str(proc.pid)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                proc.terminate()
        except Exception:
            pass
    print("[SUCCESS] All services stopped. Goodbye!\n")
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, cleanup_all)
    signal.signal(signal.SIGTERM, cleanup_all)

    print_banner()

    try:
        backend_proc = start_backend()
        time.sleep(2)

        frontend_proc = start_unified_frontend()
        time.sleep(2)

        print("\n" + "=" * 80)
        print(" ALL SERVICES ARE ONLINE & UNIFIED!")
        print("=" * 80)
        print(" 1. Unified Web App (Landing + Vendor + Gov): http://localhost:5173")
        print("    ├── Landing Page:        http://localhost:5173/#/")
        print("    ├── Vendor Portal:       http://localhost:5173/#/vendor")
        print("    └── Government Portal:   http://localhost:5173/#/gov")
        print(" 2. Shared FastAPI API & Docs:               http://127.0.0.1:8000/docs")
        print(" 3. Shared Database State:                   backend/app/data/shared_db.json")
        print("=" * 80)
        print(" Press Ctrl+C at any time in this terminal to stop all services.\n")

        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup_all()

