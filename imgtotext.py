import sys
import os
import shutil
import traceback
from pytesseract import pytesseract

# Auto-detect Tesseract binary
tesseract_path = shutil.which("tesseract")
if not tesseract_path:
    print("[ERROR] Tesseract binary not found in PATH", flush=True)
    sys.exit(1)
pytesseract.tesseract_cmd = tesseract_path
print(f"[DEBUG] Using tesseract at: {tesseract_path}", flush=True)

def extract_text(image_path: str) -> int:
    print(f"[DEBUG] Starting OCR for: {image_path}", flush=True)

    if not os.path.exists(image_path):
        print(f"[ERROR] File not found: {image_path}", flush=True)
        return 1  

    try:
        text = pytesseract.image_to_string(image_path)
        print("[DEBUG] OCR completed successfully", flush=True)
        print(text.strip(), flush=True)
        return 0
    except Exception as e:
        print("[ERROR] Exception during OCR:", flush=True)
        print(str(e), flush=True)
        traceback.print_exc()
        return 1  

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[ERROR] No image path provided", flush=True)
        sys.exit(1)

    exit_code = extract_text(sys.argv[1])
    sys.exit(exit_code)
