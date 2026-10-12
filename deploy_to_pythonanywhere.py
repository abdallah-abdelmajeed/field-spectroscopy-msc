import os
import sys
import requests

def deploy(username: str, api_token: str, domain: str = None):
    if not domain:
        domain = f"{username}.pythonanywhere.com"
    
    headers = {"Authorization": f"Token {api_token}"}
    base_url = f"https://www.pythonanywhere.com/api/v0/user/{username}"
    
    print(f"Connecting to PythonAnywhere API for user '{username}'...")
    
    # 1. Check API token validity
    r = requests.get(f"{base_url}/cpu/", headers=headers)
    if r.status_code != 200:
        print(f"Authentication failed: {r.status_code} - {r.text}")
        return False
    print("API Token authenticated successfully!")

    # 2. Upload offline zip package
    zip_path = "field-spectroscopy-msc-offline.zip"
    if os.path.exists(zip_path):
        print(f"Uploading {zip_path}...")
        remote_path = f"/home/{username}/field-spectroscopy-msc-offline.zip"
        with open(zip_path, "rb") as f:
            upload_res = requests.post(
                f"{base_url}/files/path{remote_path}",
                headers=headers,
                files={"content": f}
            )
        print(f"Upload status: {upload_res.status_code}")

    # 3. Reload web app
    print(f"Reloading webapp {domain}...")
    reload_res = requests.post(f"{base_url}/webapps/{domain}/reload/", headers=headers)
    print(f"Reload status: {reload_res.status_code} - {reload_res.text}")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 deploy_to_pythonanywhere.py <username> <api_token> [domain]")
        sys.exit(1)
    deploy(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
